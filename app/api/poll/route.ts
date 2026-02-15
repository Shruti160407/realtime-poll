import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { question, options } = await req.json();

    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        { error: "Question and at least 2 options required" },
        { status: 400 }
      );
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        options: {
          create: options.map((text: string) => ({
            text,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    // ✅ VERY IMPORTANT
    return NextResponse.json(poll);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

