import { Button, Card, CardFooter, CardHeader, Chip } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import Link from "next/link";

export async function ProjectCard({ project } : { project: any }) {
    console.log(project);

    return (
        <Link href={`projects/${project.id}`}>
            <Card isFooterBlurred className="w-full h-[300px] transform transition duration-500 hover:shadow-lg">
                <CardHeader className="absolute z-10 top-1 flex-col items-start">
                    <p className="text-tiny text-white/60 uppercase font-bold">{project.name}</p>
                    <p className="text-tiny text-white/60 font-bold">{project.description}</p>
                </CardHeader>
                <Image
                    removeWrapper
                    alt="Relaxing app background"
                    className="z-0 w-full h-full object-cover"
                    src={project.image}
                />
                <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                    <div className="flex gap-2 items-center w-full">
                        <div className="flex-shrink-0 w-10 h-11">
                            <Image
                                alt="Breathing app icon"
                                className="rounded-full w-full h-full bg-black"
                                src={project.logo}
                            />
                        </div>
                        <div className="flex flex-grow gap-2 items-center flex-wrap">
                            {project.skills && project.skills.map((skill: string) => (
                                <Chip 
                                    key={skill} 
                                    className="text-white/60 bg-black/40 rounded-full"
                                    size="sm"
                                >
                                    {skill}
                                </Chip>
                            ))}
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
