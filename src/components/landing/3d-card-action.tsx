"use client";
import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "~/components/ui/3d-card";
import Link from "next/link";
import { useTheme } from "next-themes";

export function ThreeDCardAction() {
  const { theme } = useTheme();

  const backgroundImage = theme === 'dark' ? '/join-dark.png' : '/join-light.png';

  return (
    <CardContainer className="inter-var w-full py-16">
      <CardBody className="relative group/card  ">
        <div 
          className="w-full h-full bg-cover bg-center rounded-xl hover:shadow-2xl hover:shadow-blue-500/[0.1]" 
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        >
          <div className="flex justify-center items-center h-full">
            <CardItem
              translateZ={100}
              as={Link}
              href="/auth/register"
              className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white text-xs font-bold shadow-black shadow-4xl"
            >
              Join Us
            </CardItem>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
}
