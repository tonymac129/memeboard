import type { Metadata } from "next";
import Error from "@/components/Error";
import Btn from "@/components/ui/Btn";
import Back from "@/components/Back";

export const metadata: Metadata = {
  title: "Not Found | MemeBoard",
  description:
    "Oops, how did you get here? That page doesn't exist on MemeBoard...",
  authors: [{ name: "tonymac129", url: "https://tonymac.net" }],
  openGraph: {
    title: "Not Found | MemeBoard",
    description:
      "Oops, how did you get here? That page doesn't exist on MemeBoard...",
    url: "https://memeboard-app.vercel.app",
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

function NotFound() {
  return (
    <div className="flex flex-col gap-y-10 items-center py-20">
      <Error />
      <div className="text-black dark:text-zinc-300">
        Oops, how did you get here? That page doesn&apos;t exist on MemeBoard...
      </div>
      <div className="flex gap-x-5">
        <Btn text="Home" href="/" primary />
        <Back />
      </div>
    </div>
  );
}

export default NotFound;
