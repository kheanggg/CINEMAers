import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client"; // Import Prisma types

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const movieId = searchParams.get("movie_id");
    const showDateParam = searchParams.get("show_date");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Page and limit must be positive integers." },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Parse show_date if provided
    let showDate = null;
    if (showDateParam) {
      showDate = new Date(showDateParam);
      if (isNaN(showDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid show_date format. Use ISO 8601 (e.g., 2025-01-07)." },
          { status: 400 }
        );
      }
    }

    const where: Prisma.ShowtimeWhereInput = {};

    if (showDate) {
      showDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(showDate);
      nextDay.setDate(showDate.getDate() + 1);

      where.show_date = {
        gte: showDate,
        lt: nextDay,
      };
    }

    if (movieId) {
      where.movie_id = Number(movieId);
    }

    // Use Prisma.ShowtimeScalarFieldEnum for distinct
    const distinct: Prisma.ShowtimeScalarFieldEnum[] = showDate ? ["movie_id"] : [];

    // Fetch showtimes
    const [showtimes, total] = await Promise.all([
      prisma.showtime.findMany({
        where,
        skip,
        take: limit,
        distinct, // Apply distinct only when show_date is present
        include: {
          movie: true,
        },
      }),
      prisma.showtime.count({ where }),
    ]);

    if (!showtimes.length) {
      return NextResponse.json(
        { message: "No showtimes found for the specified filters." },
        { status: 200 }
      );
    }

    return NextResponse.json({
      data: showtimes,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        perPage: limit,
      },
    });
  } catch (error: unknown) {
    // Narrow down the type of the error
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error fetching showtimes:", errorMessage);

    return NextResponse.json(
      { error: "Failed to fetch showtimes.", details: errorMessage },
      { status: 500 }
    );
  }
}
