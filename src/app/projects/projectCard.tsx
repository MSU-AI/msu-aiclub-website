import { Button, Card, CardFooter, CardHeader } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import Link from "next/link";

export async function ProjectCard({ project } : { project: any }) {
    return (
        <Card isFooterBlurred className="w-full h-[300px] transform transition duration-500 hover:-translate-y-2">
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">{project.name}</p>
        </CardHeader>
        <Image
          removeWrapper
          alt="Relaxing app background"
          className="z-0 w-full h-full object-cover"
          src={project.image}
        />
        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
          <div className="flex flex-grow gap-2 items-center">
            <Image
              alt="Breathing app icon"
              className="rounded-full w-10 h-11 bg-black"
              src={project.logo}
            />
            <div className="flex flex-col">
              <p className="text-tiny text-white/60">{project.description}</p>
            </div>
          </div>
          <Button as={Link} href={`projects/${project.id}`} radius="full" size="sm">Learn More</Button>
        </CardFooter>
      </Card>
    )
}