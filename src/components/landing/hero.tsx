import { Button } from "~/components/ui/button";
import { HoverBorderGradient } from "~/components/ui/hover-border-gradient";
import { InfiniteMovingCards } from "~/components/ui/infinite-moving-cards";    
import { SparklesCore } from "~/components/ui/sparkles";
import { scrollDown } from "~/utils/helpers";
import Link from 'next/link';

export function Hero({scrollRef} : {scrollRef: React.RefObject<HTMLDivElement>}){
    return(
          <div className="py-28 flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-center">
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
              />

              <p className="text-lg md:text-2xl absolute bottom-[50%] "> The hub for everything AI at MSU </p>

              <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,background)]"></div>
            </div>
            <div className="flex items-center justify-center gap-6 px-4">
              <Link className="" href="/auth/register">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  className="bg-[#020D28] text-white flex items-center space-x-2"
                >
                  <span className="text-sm md:text-lg">Join our growing community </span>
                </HoverBorderGradient>
              </Link>
              <Button onClick={() => scrollDown(scrollRef)} className="font-bold rounded-[0.5rem]"> Learn More</Button>
            </div>
            <div className="w-screen md:w-fit max-w-[1024px] pt-40 rounded-md flex flex-col antialiased bg-background  dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
              <InfiniteMovingCards
                direction="right"
                speed="slow"
              />
            </div>
          </div>

    );
}
