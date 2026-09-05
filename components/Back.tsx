"use client";

import Btn from "./ui/Btn";

function Back() {
  return <Btn text="Go back" onclick={() => window.history.back()} />;
}

export default Back;
