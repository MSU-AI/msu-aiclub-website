"use client"

import { cn } from "@/utils/cn";
import React from "react";
import { BentoGrid, BentoGridItem } from "~/components/ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

import  Image  from "next/image";

export function BentoWorkshop({scrollRef} : {scrollRef?: React.RefObject<HTMLDivElement>}) {
  return (
    <div ref={scrollRef}>
    <BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
    </div>
  );
}
const Skeleton = ({ src, className } : { src: string, className: string }) => (
  <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800">
    {src &&
        <Image className={`rounded-xl ${className}`} src={src} fill objectFit="cover" />
    }
  </div>
);
const items = [
  {
    title: "Transformers",
    description: "Learn about this state-of-the-art model architecture by trying it on huggingface.",
    header: <Skeleton src={"/workshops/transformer.png"} />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Video Diffusion",
    description: "Learn about how AI models can generate realistic videos.",
    header: <Skeleton src={"/workshops/video.gif"}/>,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Intro to Neural Networks",
    description: "Go through the basics of neural networks and how they work.",
    header: <Skeleton src={"/workshops/neural.jpeg"}/>,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Prompt Injection",
    description:
      "How can you trick a model into generating the output you want? Learn more here.",
    header: <Skeleton src={"/workshops/injection.png"}/>,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Will AI Take Over?",
    description: "Explore the ethical implications of AI and its future.",
    header: <Skeleton src={"/workshops/ultron.jpeg"}/>,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Multi Layer Perceptrons",
    description: "Learn about the most basic form of neural networks.",
    header: <Skeleton src="/workshops/multi-layer.png"/>,
    icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Fruit Ninja?",
    description: "Make a full-body, playable, fruit ninja game using AI.",
    header: <Skeleton src="/workshops/fruit-ninja.jpeg"/>,
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
  },
];

