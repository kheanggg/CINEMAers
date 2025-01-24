import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client"; // Import Prisma types

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showtimeId = searchParams.get("showtime_id");

    if (showtimeId) {
      const showtime = await prisma.showtime.findUnique({
        where: { showtime_id: Number(showtimeId) },
      });

      if (!showtime) {
        return NextResponse.json(
          { error: "Showtime not found." },
          { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
        );
      }

      return NextResponse.json(showtime, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    const movieId = searchParams.get("movie_id");
    const startTimeParam = searchParams.get("start_time");
    const selectedDateParam = searchParams.get("selected_date");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Page and limit must be positive integers." },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
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
          { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
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
          { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
        );
      }
    }

    // Build the where clause
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
        lt: new Date(selectedDate.getTime() + 86400000), // 1 day in milliseconds
      };
    }

    if (movieId) {
      where.movie_id = Number(movieId);
    }

    // Determine distinct fields
    let distinct: Prisma.ShowtimeScalarFieldEnum[] = [];
    if (selectedDate && !movieId) {
      distinct = ["movie_id"];
    }

    // Fetch showtimes and total count
    const [showtimes, total] = await Promise.all([
      prisma.showtime.findMany({
        where,
        skip,
        take: limit,
        distinct: distinct.length > 0 ? distinct : undefined,
        include: {
          movie: true,
        },
      }),
      prisma.showtime.count({ where }),
    ]);

    // Handle no results
    if (!showtimes.length) {
      return NextResponse.json(
        { message: "No showtimes found for the specified filters." },
        { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Return results with pagination metadata
    return NextResponse.json({
      data: showtimes,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        perPage: limit,
      },
    }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (error: unknown) {
    // Narrow down the type of the error
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error fetching showtimes:", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch showtimes.", details: errorMessage },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}