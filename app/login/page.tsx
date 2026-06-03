import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import LogIn from "./LogIn";

export const metadata: Metadata = {
  title: "Log In | MemeBoard",
  description:
    "Log in to MemeBoard here with credentials, Google, or GitHub, or create an account if you don't already have one!",
};

async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/profile");

  return <LogIn />;
}

export default Page;
