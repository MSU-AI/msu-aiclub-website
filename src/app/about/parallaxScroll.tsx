"use client";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { LinkedInLogoIcon, GitHubLogoIcon, GlobeIcon } from "@radix-ui/react-icons";
import { cn } from "~/lib/utils";

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

export const ParallaxScroll = ({
  members,
  className,
}: {
  members: BoardMember[];
  className?: string;
}) => {
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(members.length / 3);
  const firstPart = members.slice(0, third);
  const secondPart = members.slice(third, 2 * third);
  const thirdPart = members.slice(2 * third);

  const MemberCard = ({ member }: { member: BoardMember }) => (
    <div className="relative group">
      <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
        <Image 
          src={member.profilePicture} 
          alt={member.name} 
          layout="fill" 
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-white text-center">
            <p className="font-bold">{member.name}</p>
            <p>{member.position}</p>
            <p className="text-sm">{member.email}</p>
          </div>
        </div>
      </div>
      <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {member.linkedin && (
          <Button size="icon" variant="secondary" asChild>
            <Link href={member.linkedin}>
              <LinkedInLogoIcon className="h-4 w-4" />
            </Link>
          </Button>
        )}
        {member.github && (
          <Button size="icon" variant="secondary" asChild>
            <Link href={member.github}>
              <GitHubLogoIcon className="h-4 w-4" />
            </Link>
          </Button>
        )}
        {member.personalSite && (
          <Button size="icon" variant="secondary" asChild>
            <Link href={member.personalSite}>
              <GlobeIcon className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={cn("h-[40rem] items-start overflow-y-auto w-full", className)}
      ref={gridRef}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 py-40 px-10"
        ref={gridRef}
      >
        <div className="grid gap-10">
          {firstPart.map((member) => (
            <motion.div
              style={{ y: translateFirst }}
              key={member.id}
            >
              <MemberCard member={member} />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((member) => (
            <motion.div
              style={{ y: translateSecond }}
              key={member.id}
            >
              <MemberCard member={member} />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {thirdPart.map((member) => (
            <motion.div
              style={{ y: translateThird }}
              key={member.id}
            >
              <MemberCard member={member} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
