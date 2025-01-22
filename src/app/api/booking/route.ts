import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, showtimeId, seats, totalPrice } = body;

        if (!userId || !showtimeId || !seats || !totalPrice) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const booking = await prisma.booking.create({
            data: {
                userId,
                showtimeId,
                seats,
                totalPrice,
            },
        });
        return NextResponse.json(booking, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}