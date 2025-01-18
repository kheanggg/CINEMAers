import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client"; // Import Prisma types

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const movieId = searchParams.get("movie_id");
    const startTimeParam = searchParams.get("start_time");
    const selectedDateParam = searchParams.get("selected_date");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Page and limit must be positive integers." },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Parse start_time if provided
    let startTime = null;
    if (startTimeParam) {
      startTime = new Date(startTimeParam);
      if (isNaN(startTime.getTime())) {
        return NextResponse.json(
          { error: "Invalid start_time format. Use ISO 8601 (e.g., 2025-01-07T14:30:00)." },
          { status: 400 }
        );
      }
    }

    // Parse selected_date if provided
    let selectedDate = null;
    if (selectedDateParam) {
      selectedDate = new Date(selectedDateParam);
      if (isNaN(selectedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid selected_date format. Use ISO 8601 (e.g., 2025-01-07)." },
          { status: 400 }
        );
      }
    }

    const where: Prisma.ShowtimeWhereInput = {};

    if (startTime) {
      const nextHour = new Date(startTime);
      nextHour.setHours(nextHour.getHours() + 1);

      where.start_time = {
        gte: startTime,
        lt: nextHour,
      };
    }

    if (selectedDate) {
      where.show_date = {
        gte: selectedDate,
        lt: new Date(selectedDate.getTime() + 86400000), // 86400000 is the number of milliseconds in a day
      };
    }

    if (movieId) {
      where.movie_id = Number(movieId);
    }

    // Use Prisma.ShowtimeScalarFieldEnum for distinct
    let distinct: Prisma.ShowtimeScalarFieldEnum[] = [];

    // If only date is provided, return distinct movies
    if (selectedDate && !movieId) {
      distinct = ["movie_id"];
    }

    // Fetch showtimes
    const [showtimes, total] = await Promise.all([
      prisma.showtime.findMany({
        where,
        skip,
        take: limit,
        distinct,
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