import type { Metadata } from "next";
import Hero from "@/components/layout/Hero";

export const metadata: Metadata = {
  title: "Chat | MemeBoard",
  description:
    "Chat about random stuff, share memes, and hang out with your friends here!",
};

function Page() {
  return (
    <div className="px-50 pb-30">
      <Hero
        text="Chat"
        description="Chat about random stuff, share funny memes on MemeBoard, and hang out with your friends here!"
      />
    </div>
  );
}

export default Page;
