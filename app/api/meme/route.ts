import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const memeId = req.nextUrl.searchParams.get("memeId");
    const memeData = await prisma.meme.findUnique({
      where: { id: Number(memeId) },
      include: { user: true, comments: true, upvotes: true, downvotes: true },
    });
    if (memeData) {
      return NextResponse.json(memeData);
    } else {
      return NextResponse.json({ error: "Meme not found" }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch meme: " + err },
      { status: 500 },
    );
  }
}
