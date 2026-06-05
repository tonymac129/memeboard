import type { Metadata } from "next";
import Hero from "@/components/layout/Hero";

export const metadata: Metadata = {
  title: "Memes | MemeBoard",
  description:
    "Browse, search, explore, and discover all kinds of memes curated by the community here with custom tags and filters!",
};

function Page() {
  return (
    <div className="px-50 pb-30">
      <Hero
        text="Explore Memes"
        description="Browse, search, explore, and discover all kinds of memes curated by the community here with custom tags and filters!"
      />
    </div>
  );
}

export default Page;
