"use client";
import React, { useState, useRef, useEffect } from "react";
import { LayoutGrid } from "~/components/ui/layout-grid";

export function LayoutGridCommunity({scrollRef} : {scrollRef: React.RefObject<HTMLDivElement>}) {
  return (
    <div className="py-10 w-full" ref={scrollRef}>
      <LayoutGrid cards={cards} directionHover={true} globe={true}/>
    </div>
  );
}

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold text-4xl text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Qatar AI Conference</p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        The MSU AI Club was invited to the Qatar AI Conference to present their work on AI and ML. 
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold text-4xl text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Industry Guests</p>
      <p className="font-normal text-base text-white "></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        Our industry guests provide students with insights into the real-world applications of AI while also
        providing a flurishing enviornment for student x industry connections. 
      </p>
    </div>
  );
};
const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold text-4xl text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Club Collaboration</p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        We often collaborate with other clubs both at MSU and abroad to provide students with a diverse range of 
        experiences and opportunities.
      </p>
    </div>
  );
};


const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail:
      "/community/qatar.jpeg",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail:
      "/community/rocket.png",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail:
      "/community/colab.jpg",
  },
];

