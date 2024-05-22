"use client";
import React from "react";
import { BackgroundBeams } from "~/components/ui/background-beams";

export function ComingSoon() {
  return (
    <div className="h-screen w-full rounded-md bg-background relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-4xl md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          We cooking rn come back later 
        </h1>
        </div>
      <BackgroundBeams />
    </div>
  );
}

