import { NextRequest, NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import prisma from "@/app/lib/prisma";
import { IncomingHttpHeaders } from 'http';



export async function GET(request: NextRequest, params: { params: Promise<{ movieId: string }> }) {

  const { movieId } = await params.params;

  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const req = {
    headers,
    method: request.method,
    url: request.url,
    params: { movieId },
  };

  try {
    const session = await getSession({ req }); 

    if (!session?.user?.id) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    const movieId = Number((await params.params).movieId);

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId: Number(userId),
          movieId: movieId,
        },
      },
    });

    return NextResponse.json({ isFavorite: !!favorite }); // Return true if the movie is in favorites
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}