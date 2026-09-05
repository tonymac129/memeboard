import type { MessageType } from "@/types/Chat";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import Container from "../[username]/Container";

export const metadata: Metadata = {
  title: "MemeBot | Chat | MemeBoard",
  description: "Interact with the useless but funny MemeBot in realtime here!",
  authors: [{ name: "tonymac129", url: "https://tonymac.net" }],
  openGraph: {
    title: "MemeBot | Chat | MemeBoard",
    description:
      "Interact with the useless but funny MemeBot in realtime here!",
    url: "https://memeboard-app.vercel.app/chat/memebot",
    siteName: "MemeBoard",
    images: [
      {
        url: "/logo.png",
        width: 100,
        height: 100,
      },
    ],
    type: "website",
  },
};

export const botMessage = {
  id: "qwertyuiop",
  message:
    "Beep beep boop boop... Hello world, I'm MemeBot, a bot that is totally not AI! If you have any questions or need any assistance, I will not be able to help you :D",
  created: new Date(),
  from: "memebot",
  chatId: "",
};

async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  const [userId1, userId2] = ["memebot", session?.user.id || "guest"].sort();
  const chat = await prisma.chat.findUnique({
    where: { userId1_userId2: { userId1, userId2 } },
  });
  const messages: MessageType[] = await redis.lrange(
    `messages:${chat?.id || ""}`,
    0,
    -1,
  );

  return (
    <Container
      messages={messages.length > 0 ? messages : [botMessage]}
      chat={chat}
    />
  );
}

export default Page;
