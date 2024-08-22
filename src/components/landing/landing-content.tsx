"use client";

import { useRef } from "react";
import { FeaturedPosts } from '~/components/landing/featured-posts';
import { FeaturedProjects } from '~/components/landing/featured-projects';
import { CanvasRevealLanding } from '~/components/landing/canvas-reveal-landing';
import { LayoutGridCommunity } from '~/components/landing/layout-grid-community';
import { ThreeDCardAction } from '~/components/landing/3d-card-action';
import { Contacts } from '~/components/landing/contacts';
import { Footer } from '~/components/landing/footer';
import AccordianComponent from "~/components/landing/faq";
import { Hero } from "~/components/landing/hero";

interface LandingContentProps {
  topPosts: any[];
  topProjects: any[];
  isAdmin: boolean;
  userId: string | null;
}



export function LandingContent({ topPosts, topProjects, isAdmin, userId }: LandingContentProps) {

  const canvasRef = useRef<HTMLDivElement>(null);
  const workshopRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);

  
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="w-screen max-w-[1024px] px-4 pt-16">
          <Hero  scrollRef={canvasRef}/>
          <CanvasRevealLanding scrollRef={canvasRef} firstRef={workshopRef} secondRef={projectRef} thirdRef={communityRef} />
          <FeaturedPosts scrollRef={workshopRef} posts={topPosts} isAdmin={isAdmin} />
          <FeaturedProjects projects={topProjects} isAdmin={isAdmin} userId={userId} scrollRef={projectRef} />  
          <LayoutGridCommunity scrollRef={communityRef} />
          <ThreeDCardAction />
          <AccordianComponent />
          <Contacts />
          <Footer />
        </div>
      </div>
    </>
  );
}
