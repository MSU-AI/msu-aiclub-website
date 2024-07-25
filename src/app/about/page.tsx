"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ParallaxScroll } from './parallaxScroll';
import boardMembersData from './boardMembers.json';

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
    <div className="max-w-[1024px] mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Our Team</h1>
      
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
    </div>
  );
}
