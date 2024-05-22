"use client";
import React from "react";
import { type RefObject } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "~/components/ui/canvas-reveal-effect";

import { scrollDown } from "~/utils/helpers";


export function CanvasRevealLanding({scrollRef, firstRef, secondRef, thirdRef} : {scrollRef: RefObject<HTMLDivElement>, firstRef: RefObject<HTMLDivElement>, secondRef: RefObject<HTMLDivElement>, thirdRef: RefObject<HTMLDivElement>}) {
  return (
    <>
      <div ref={scrollRef} className="py-20 flex flex-col lg:flex-row items-center justify-center bg-background w-full gap-4 mx-auto px-8">
        <Card title="Workshops" letter={"M"} scrollRef={firstRef}> 
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-emerald-900"
          />
        </Card>
        <Card title="Projects" letter={"S"} scrollRef={secondRef}>
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-black"
            colors={[
              [236, 72, 153],
              [232, 121, 249],
            ]}
            dotSize={2}
          />
          {/* Radial gradient for the cute fade */}
          <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/90" />
        </Card>
        <Card title="Communial Events" letter={"U"} scrollRef={thirdRef}>
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-sky-600"
            colors={[[125, 211, 252]]}
          />
        </Card>
      </div>
    </>
  );
}

const Card = ({
  title,
  letter,
  children,
  scrollRef,

}: {
  title: string;
  letter: React.ReactNode;
  children?: React.ReactNode;
  scrollRef?: RefObject<HTMLDivElement>;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => scrollDown(scrollRef)}
      className="border cursor-pointer group/canvas-card flex items-center justify-center border-white/[0.2]  max-w-sm w-full mx-auto p-4 relative h-[30rem] relative"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 text-whitek" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white " />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white " />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white" />


      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20">
        <div className="text-8xl font-bold text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full  mx-auto flex items-center justify-center">
           {letter} 
        </div>
        <h2 className="text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10  mt-4  font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
          {title}
        </h2>
      </div>
    </div>
  );
};


export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

