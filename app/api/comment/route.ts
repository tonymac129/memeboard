import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const commentId = req.nextUrl.searchParams.get("commentId");
    const commentData = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
      include: { user: true, likedBy: true },
    });
    if (commentData) {
      return NextResponse.json(commentData);
    } else {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch comment: " + err },
      { status: 500 },
    );
  }
}
