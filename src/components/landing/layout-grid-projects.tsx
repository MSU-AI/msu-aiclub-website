"use client";
import React, { useState, useRef, useEffect } from "react";
import { LayoutGrid } from "~/components/ui/layout-grid";

export function LayoutGridProjects({scrollRef} : {scrollRef?: React.RefObject<HTMLDivElement>}) {
  return (
    <div className="min-h-screen py-10 w-full" ref={scrollRef}>
      <LayoutGrid cards={cards} directionHover={true} globe={false}/>
    </div>
  );
}

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold text-4xl text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">AI Transcript Video Editor</p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        A video editor that allows users to edit videos by editing the transcript.
        It&apos;s a tool that helps users edit videos faster and more efficiently.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold text-3xl text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Concept Map Browser Extension</p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        A browser extension that allows users to create concept maps from web pages. 
        It&apos;s a tool that helps users visualize and organize information in a more structured way.
      </p>
    </div>
  );
};
const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold text-4xl text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Pet Cues</p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        A web application that helps users understand what their pet is feeling using AI. 
      </p>
    </div>
  );
};
const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold text-4xl text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Quarry.video</p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        Upload a video, and get all the clipable moments in a video edited for you in accordance to the latest trends.
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2 cursor-pointer",
    thumbnail:
      "/projects/transcript.gif",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1 cursor-pointer",
    thumbnail:
      "/projects/concept-map.gif",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1 cursor-pointer",
    thumbnail:
      "/projects/pet.gif",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2 cursor-pointer",
    thumbnail:
      "/projects/quarry.png",
  },
];

