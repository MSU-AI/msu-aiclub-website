import { Button, Card, CardHeader} from "@nextui-org/react";
import Image from "next/image";
import AccordianComponent from "./accordianComponent";
import Link from "next/link";
import { HeroParallax } from "~/components/ui/hero-parallax";
import { SparklesCore } from "~/components/ui/sparkles";
import { InfiniteMovingCards } from "~/components/ui/infinite-moving-cards";
import {HoverBorderGradient} from "~/components/ui/hover-border-gradient";




export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-white gap-12 min-h-screen">
      <div className="h-[40rem] w-full  flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
        AI Club @ MSU
      </h1>
      <div className="flex flex-col items-center justify-center w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
 
        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
        <div className="absolute top-[30%] left-[25%]">
        <p className="text-2xl"> The hub for everything AI at MSU </p>
        </div>

        <Link href="/auth/register">
                    <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="button"
                        className="bg-black text-white flex items-center space-x-2"
                    >
                        <span className="text-lg">Join our growing community {`>`} </span>
                    </HoverBorderGradient>
        </Link>
 
        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-[#121212] [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div> 
    <div className="h-[10rem] rounded-md flex flex-col antialiased bg-background dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        direction="right"
        speed="slow"
      />
    </div>
          <div className="flex flex-col items-center justify-center p-10 gap-2 w-[60vw] h-[80vh]">
           <p className="text-2xl font-bold text-white">FAQ</p>
           <AccordianComponent />
      </div>
      <div>
        <p className="text-xs">Made by Imagine Software</p>
      </div>
    </div>
  );
}
