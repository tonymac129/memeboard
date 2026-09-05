import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import LogIn from "./LogIn";

export const metadata: Metadata = {
  title: "Log In | MemeBoard",
  description:
    "Log in to MemeBoard here with credentials, Google, or GitHub, or create an account if you don't already have one!",
  authors: [{ name: "tonymac129", url: "https://tonymac.net" }],
  openGraph: {
    title: "Log In | MemeBoard",
    description:
      "Log in to MemeBoard here with credentials, Google, or GitHub, or create an account if you don't already have one!",
    url: "https://memeboard-app.vercel.app/login",
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

async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect(`/users/${session.user.username}`);

  return <LogIn />;
}

export default Page;
