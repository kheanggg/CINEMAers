import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"; // Adjust to your actual Prisma client path

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cinema_id = searchParams.get("cinema_id"); // Get `cinema_id` from query parameters

  try {
    if (cinema_id) {
      // Fetch a specific cinema by ID
      const cinema = await prisma.cinema.findUnique({
        where: { cinema_id: parseInt(cinema_id, 10) }, // Use cinema_id instead of id
      });

      if (!cinema) {
        return NextResponse.json(
          { error: "Cinema not found" },
          { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
        );
      }

      return NextResponse.json({ data: cinema }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    } else {
      // Fetch all cinemas
      const cinemas = await prisma.cinema.findMany();
      return NextResponse.json({ data: cinemas }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }
  } catch (error) {
    console.error("Error fetching cinemas:", error);
    return NextResponse.json(
      { error: "Failed to fetch cinemas" },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}