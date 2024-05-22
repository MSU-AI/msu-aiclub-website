"use client";

import { cn } from "~/lib/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Item {
  image: string;
  name: string;
}

const items: Item[] = [
  {
    image: "/sponsors/auto-owners.png",
    name: "Auto Owners"
  },
  {
    image: "/sponsors/kpit.png",
    name: "Kpit"
  },
  {
    image: "/sponsors/burgess.png",
    name: "Burgess Institute"
  },
  {
    image: "/sponsors/dchous.png",
    name: "digital consultinghaus"
  },
  {
    image: "/sponsors/msurf.png",
    name: "MSU Research Foundation"
  },
  {
    image: "/sponsors/rocket.png",
    name: "Rocket Mortgage"
  },
];

export const InfiniteMovingCards = ({
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  className,
}: {
  items?: {
    image: string;
    name: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 overflow-hidden   w-screen md:w-fit max-w-[1024px] [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          " flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll ",
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[350px] flex items-center justify-center max-w-full saturate-0 hover:saturate-50 transition ease-in-out duration-300 relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-8 py-6 md:w-[450px]"
            key={item.name}
          >
            <blockquote>
              <Image
                width={350}
                height={150}
                src={item.image}
                alt={item.name}
              />
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};

