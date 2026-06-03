import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Hero from "@/components/layout/Hero";
import SignOut from "@/components/auth/SignOut";

export const metadata: Metadata = {
  title: "Profile | MemeBoard",
  description: "Customize your profile and change your account settings here!",
};

async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <div className="px-50">
      <Hero
        text="Profile"
        description="Customize your profile and change your account settings here!"
      />
      <div className="flex flex-col items-center">
        <SignOut />
      </div>
    </div>
  );
}

export default Page;
