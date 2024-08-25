"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ParallaxScroll } from './parallaxScroll';
import boardMembersData from './boardMembers.json';
import { AchievementsCarousel } from './carousel';
import { Footer } from '~/components/landing/footer';

interface BoardMember {
  id: string;
  name: string;
  position: string;
  email: string;
  profilePicture: string;
  linkedin?: string;
  github?: string;
  personalSite?: string;
}

 interface BoardMembersData {
  boardMembers: {
    [year: string]: BoardMember[];
  };
}

const typedBoardMembersData = boardMembersData as BoardMembersData;

export default function AboutPage() {
  const years = Object.keys(typedBoardMembersData.boardMembers).reverse();

  return (
    <div className="max-w-[1024px] mx-auto px-4 py-16 pt-28">
      <div className='flex flex-col gap-7'>
      <h1 className='text-6xl font-semibold'>About us</h1>
      <p>We are the largest computer science club at Michigan State university.</p>
      <p>Our <span className='font-bold'> mission </span> is to empower students with the knowledge of Artificial Intelligence through an inclusive environment that closes the gap between curiosity and hands-on practice in the field.</p>
      <p>We have become Michigan State University’s hub for the learning and application of Artificial Intelligence among undergraduate students.</p>
      </div>
      <AchievementsCarousel />  
      <h1 className="text-5xl font-semibold mb-8">Our Team</h1>
      <Tabs defaultValue={years[3]}>
        <TabsList className="grid w-full grid-cols-4">
          {years.map((year) => (
            <TabsTrigger key={year} value={year}>
              {year}
            </TabsTrigger>
          ))}
        </TabsList>
        {years.map((year) => (
          <TabsContent key={year} value={year}>
            <ParallaxScroll
              members={typedBoardMembersData.boardMembers[year]}
            />
          </TabsContent>
        ))}
      </Tabs>
    <Footer />
    </div>
  );
}
