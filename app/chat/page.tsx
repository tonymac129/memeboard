import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat | MemeBoard",
  description:
    "Chat about random stuff, share memes, and hang out with your friends here!",
};

function Page() {
  return (
    <div className="h-full flex flex-col gap-y-5 items-center justify-center">
      <h1 className="text-green-500 font-bold text-4xl">Chat</h1>
      <p className="text-zinc-300 w-[60%] text-center">
        Chat about random stuff, share memes, and hang out with your friends
        here!
      </p>
      <p className="text-zinc-300 w-[60%] text-center">
        Click on a friend on the left sidebar to get started, or follow your
        friends to add them to the sidebar!
      </p>
    </div>
  );
}

export default Page;
