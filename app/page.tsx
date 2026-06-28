import Hero from "@/components/layout/Hero";

function Page() {
  return (
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 pb-30">
      <Hero
        text="Welcome to MemeBoard!"
        description="Explore the trendiest memes, upload your own creations, chat with your friends, interact with the community, and more!"
      />
    </div>
  );
}

//TODO: add lazy loading/loading indicator for certain pages

// TODO: put the most recent and popular memes on the homepage

export default Page;
