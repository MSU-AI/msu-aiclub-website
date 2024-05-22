"use client"
import { useRef } from "react"
import { type RefObject } from "react";

import { Card, CardHeader } from "@nextui-org/react";
import { Button } from "~/components/ui/button";

import Image from "next/image";
import Link from "next/link";

import AccordianComponent from "./accordianComponent";

import { HeroParallax } from "~/components/ui/hero-parallax";
import { SparklesCore } from "~/components/ui/sparkles";
import { InfiniteMovingCards } from "~/components/ui/infinite-moving-cards";
import { HoverBorderGradient } from "~/components/ui/hover-border-gradient";
import { TracingBeam } from "~/components/ui/tracing-beam";

import { CanvasRevealLanding } from "~/components/landing/canvas-reveal-landing";
import { BentoWorkshop } from "~/components/landing/bento-workshop";
import { LayoutGridCommunity } from "~/components/landing/layout-grid-community";
import { LayoutGridProjects } from "~/components/landing/layout-grid-projects";
import { ParallaxScroll } from "~/components/landing/parallax-scroll-about";
import { ThreeDCardAction } from "~/components/landing/3d-card-action";
import { Contacts } from "~/components/landing/contacts";
import { Footer } from "~/components/landing/footer";

import { parallaxImages } from "~/data/data";

import { scrollDown } from "~/utils/helpers";

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const workshopRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="w-screen max-w-[1024px] px-4">
          <div className="py-28 flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-center text-white">
              AI Club @ MSU
            </h1>
            
            <div className="flex flex-col items-center justify-center h-40 relative w-screen md:w-[40rem]">

              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />


              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={1200}
                className="h-full w-screen md:w-full"
                particleColor="#FFFFFF"
              />

              <p className="text-lg md:text-2xl absolute bottom-[50%] "> The hub for everything AI at MSU </p>


              <div className="absolute inset-0 w-full h-full bg-[#121212] [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
            </div>
            <div className="flex items-center justify-center gap-6 px-4">
              <Link className="" href="/auth/register">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  className="bg-[#020D28] text-white flex items-center space-x-2"
                >
                  <span className="text-sm md:text-lg">Join our growing community {`>`} </span>
                </HoverBorderGradient>
              </Link>
              <Button onClick={() => scrollDown(canvasRef)} className="font-bold rounded-[0.5rem]"> Learn More</Button>

            </div>
            <div className="w-screen md:w-fit max-w-[1024px] pt-40 rounded-md flex flex-col antialiased bg-white dark:bg-background dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
            <InfiniteMovingCards
              direction="right"
              speed="slow"
            />
          </div>
          </div>
          
        
          <h1 className="text-4xl lg:text-7xl font-bold text-center text-white pt-16">What we do...</h1>
          <CanvasRevealLanding scrollRef={canvasRef} firstRef={workshopRef} secondRef={projectRef} thirdRef={communityRef} />

          <div className="py-28">
            <h1 className="text-2xl lg:text-4xl font-bold text-center text-white py-6 ">Weekly Workshops</h1>
            <BentoWorkshop scrollRef={workshopRef} />
          </div>

          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-center text-white ">Some of our past projects</h1>
            <LayoutGridProjects scrollRef={projectRef} />
          </div>

          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-center text-white md:hidden ">Our communal events</h1>
            <LayoutGridCommunity scrollRef={communityRef} />
          </div>

          {/*}
          <div className="py-24">
            <h1 className="text-2xl lg:text-4xl font-bold text-center text-white py-2">The people that make it happen</h1>
            <ParallaxScroll images={parallaxImages} />
          </div>
          */}

          <ThreeDCardAction />

          <div className="flex flex-col items-center justify-center p-10 gap-2">
            <p className="text-2xl font-bold text-white">FAQ</p>
            <AccordianComponent />
          </div>

          <div className="py-24">
            <h1 className="text-2xl lg:text-4xl font-bold text-center text-white py-20">Connect with us</h1>
            <Contacts />
          </div>

        </div>
      </div>
     <Footer />
    </>
  );
}

