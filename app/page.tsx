import Hero from "@/components/layout/Hero";

function Page() {
  return (
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 pb-30">
      <Hero
        text="Welcome to MemeBoard!"
        description="Explore the trendiest memes right now, upload your own creations and share with friends, and interact with the community!"
      />
    </div>
  );
}

export default Page;
