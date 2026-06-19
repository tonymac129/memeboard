import type { MessageType } from "@/types/Chat";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Container from "./Container";

async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const userData = await prisma.user.findUnique({
    where: {
      username,
      AND: {
        followers: { some: { id: session.user.id } },
        following: { some: { id: session.user.id } },
      },
    },
    include: { followers: true, following: true },
  });
  if (!userData) redirect("/chat");
  const [userId1, userId2] = [userData.id, session.user.id].sort();
  const chat = await prisma.chat.findUnique({
    where: { userId1_userId2: { userId1, userId2 } },
  });
  const messages: MessageType[] = await redis.lrange(
    `messages:${chat?.id || ""}`,
    0,
    -1,
  );

  return <Container userData={userData} messages={messages} chat={chat} />;
}

export default Page;
