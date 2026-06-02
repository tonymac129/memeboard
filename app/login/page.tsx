import type { Metadata } from "next";
import LogIn from "./LogIn";

export const metadata: Metadata = {
  title: "Log In | MemeBoard",
  description:
    "Log in to MemeBoard here with credentials, Google, or GitHub, or create an account if you don't already have one!",
};

function Page() {
  return <LogIn />;
}

export default Page;
