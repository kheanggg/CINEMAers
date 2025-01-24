import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client"; // Import Prisma types

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cinemaId = searchParams.get("cinema_id");

    if (cinemaId) {
      const cinema = await prisma.cinema.findUnique({
        where: { cinema_id: Number(cinemaId) },
      });

      if (!cinema) {
        return NextResponse.json(
          { error: "Cinema not found." },
          { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
        );
      }

      return NextResponse.json(cinema, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    const name = searchParams.get("name");
    const location = searchParams.get("location");
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

    // Build the where clause
    const where: Prisma.CinemaWhereInput = {};

    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    // Fetch cinemas and total count
    const [cinemas, total] = await Promise.all([
      prisma.cinema.findMany({
        where,
        skip,
        take: limit,
      }),
      prisma.cinema.count({ where }),
    ]);

    // Handle no results
    if (!cinemas.length) {
      return NextResponse.json(
        { message: "No cinemas found for the specified filters." },
        { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Return results with pagination metadata
    return NextResponse.json({
      data: cinemas,
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
    console.error("Error fetching cinemas:", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch cinemas.", details: errorMessage },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, location } = data;

    // Validate required fields
    if (!name || !location) {
      return NextResponse.json(
        { error: "name and location are required." },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Create new cinema
    const newCinema = await prisma.cinema.create({
      data: {
        name,
        location,
      },
    });

    return NextResponse.json(newCinema, { status: 201, headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error creating cinema:", errorMessage);
    return NextResponse.json(
      { error: "Failed to create cinema.", details: errorMessage },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

export const config = {
  api: {
    bodyParser: true,
    methods: ['GET', 'POST'], // Allow GET and POST methods
  },
};
