"use client";

import { useState } from "react";
import Hero from "@/components/layout/Hero";
import LogInForm from "@/components/auth/LogInForm";

function LogIn() {
  const [isLogIn, setIsLogIn] = useState<boolean>(true);

  return (
    <div className="max-w-400 mx-auto px-5 sm:px-20 lg:px-50 pb-30">
      <Hero
        text={isLogIn ? "Log In" : "Sign Up"}
        description="Log in to MemeBoard here with credentials, Google, or GitHub, or create an account if you don't already have one!"
      />
      <div className="flex flex-col items-center">
        <LogInForm isLogIn={isLogIn} setIsLogIn={setIsLogIn} />
      </div>
    </div>
  );
}

export default LogIn;
