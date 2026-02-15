import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const { pollId, optionId, voterId } = await req.json();

    if (!pollId || !optionId || !voterId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        pollId_voterId: {
          pollId,
          voterId,
        },
      },
    });

    if (existingVote) {
      // Rate limiting (5-second cooldown)
      const lastVoteTime = new Date(existingVote.createdAt).getTime();
      const now = Date.now();
      const timeDiff = now - lastVoteTime;

      if (timeDiff < 2000) {
        return NextResponse.json(
          { error: "Please wait before changing vote again" },
          { status: 429 }
        );
      }

      // Update vote instead of blocking
      await prisma.vote.update({
        where: {
          pollId_voterId: {
            pollId,
            voterId,
          },
        },
        data: {
          optionId,
          createdAt: new Date(), // update timestamp for cooldown tracking
        },
      });

    } else {
      // First-time vote
      await prisma.vote.create({
        data: {
          pollId,
          optionId,
          voterId,
          ipAddress: "dummy-ip", // optional future enhancement
        },
      });
    }

    // Fetch updated poll for real-time sync
    const updatedPoll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          include: {
            votes: true,
          },
        },
      },
    });

    // Trigger real-time update
    await pusherServer.trigger(
      `poll-${pollId}`,
      "vote-updated",
      updatedPoll
    );

    return NextResponse.json({ message: "Vote recorded" });

  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
