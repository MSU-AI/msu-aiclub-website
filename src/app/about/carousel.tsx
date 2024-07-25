"use client";
import { Description } from "@radix-ui/react-toast";
import Image from "next/image";
import React from "react";
import { Carousel, Card } from "~/components/ui/apple-cards-carousel";

export function AchievementsCarousel() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="text-2xl md:text-5xl font-semibold text-neutral-800 dark:text-neutral-200 font-sans">
        Some of our latest achievements
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = ({ category, title, src, description }) => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-xl font-sans mb-4">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">
          {category}
        </span>
      </p>
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">
        {title}
      </h2>
      <Image
        src={src}
        alt={title}
        height="500"
        width="500"
        className="w-full h-auto mx-auto object-cover rounded-lg mb-6"
      />
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg font-sans max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  );
};

const data = [
  {
    category: "SS24",
    title: "Project Showcase And Judging",
    src: "/closing-cer.jpg",
    content: <DummyContent 
      category="FS24"
      title="Project Showcase And Judging"
      src="/closing-cer.jpg"
      description="Judges from industry, academia, and the community came together to evaluate our projects."
    />,
  },
  {
    category: "SS24",
    title: "KPIT Guest Speaker",
    src: "/kpit.jpg",
    content: <DummyContent 
      category= "SS24"
      title= "KPIT Guest Speaker"
      src= "/kpit.jpg"
      description= "We had the pleasure of hosting a guest speaker from KPIT, who shared their insights on the future of AI in the automotive industry."
    />,
  },
  {
    category: "SS24",
    title: "AI X Cybersecurity",
    src: "/cybersecurity.jpg",
    content: <DummyContent
        category= "SS24"
        title= "AI X Cybersecurity"
        src= "/cybersecurity.jpg"
        description= "We hosted an interactive collaberative workshop with the Cybersecurity Club to explore the intersection of AI and cybersecurity. Specifically we explored the power of prompt injection."
    />,
  },

  {
    category: "FS23",
    title: "AI Club In Qatar",
    src: "/community/qatar.jpeg",
    content: <DummyContent
        category= "FS23"
        title= "AI Club In Qatar"
        src= "/community/qatar.jpeg"
        description= "In Fall 2023 the MSU AI Club was invited to attend the Qatar AI Conference. We had the opportunity to present our projects and network with other AI enthusiasts."
    />,
  },
  {
    category: "FS23",
    title: "AI Research Pannel",
    src: "/bruh.jpg",
    content: <DummyContent
        category= "FS23"
        title= "AI Research Pannel"
        src= "/bruh.jpg"
        description= "We hosted a research pannel with professors from the AI department to discuss the latest advancements in AI research."
    />,
  },
  {
    category: "FS23",
    title: "Kickoff Event",
    src: "/kickoff.jpg",
    content: <DummyContent 
        category= "FS23"
        title= "Kickoff Event"
        src= "/kickoff.jpg"
        description= "Our kickoff event was a huge success! We had over 250 students attend and participate in our AI trivia game."
    />,
  },
];

