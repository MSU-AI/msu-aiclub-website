import { Card, CardHeader} from "@nextui-org/react";
import Image from "next/image";
import AccordianComponent from "./accordianComponent";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-white gap-12 min-h-screen">
      <div className="flex flex-col items-center justify-center p-10 gap-2 w-full h-[80vh]">
        <Image src="/Symbol-Brand-Colors.png" alt="MSU AI Club Logo" width={200} height={200} />
        <div className="w-full flex flex-row items-center justify-center lg:text-5xl md:text-3xl sm:text-lg whitespace-nowrap">
          <p>Welcome to the</p>
          <p className="font-bold ml-3">AI Club</p>
        </div>
        <p className="lg:text-base md:text-sm sm:text-xs">Exploring the boundless world of AI, together.</p>
      </div>
      <div className="flex flex-row items-center justify-between gap-4 w-full h-[80vh]">
        <div className="w-1/2">
          <p className="lg:text-5xl md:text-3xl sm:text-lg">
            Who are we?
          </p>
          <p>
            The AI Club is a fast-growing 
            student organization at 
            Michigan State University driven 
            by the passion and curiosity for 
            one of the most promising branches 
            of Computer Science: Artificial Intelligence.
          </p>
        </div>
        <div className="w-1/2 relative rounded-lg overflow-hidden h-full">
          <Image
            fill
            src="/standing.png"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="Workshop Presenter Standing"
            style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-4 w-full h-[80vh]">
        <div className="w-1/2 relative rounded-lg overflow-hidden h-full">
          <Image
            fill
            src="/standing.png"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="Workshop Presenter Standing"
            style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
          />
        </div>
        <div className="w-1/2">
          <p className="lg:text-5xl md:text-3xl sm:text-lg">
            Our Mission
          </p>
          <p>
          Our mission is to empower students 
          with the knowledge of Artificial 
          Intelligence through an inclusive 
          environment that closes the gap between 
          curiosity and hands-on practice in the field.
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-4 w-full h-[80vh]">
            <Card className="col-span-12 sm:col-span-4 h-[80vh] w-[80vw] rounded-lg">
              <CardHeader className="absolute z-10 top-1 flex-col items-center h-[80vh] justify-center">
                <h4 className="text-white font-medium text-large">Join our community.</h4>
                <p className="text-white text-sm">
                  Learn about the latest AI developments, 
                  how to use them, implement them, 
                  and hear from a range of speakers 
                  that work with AI everyday.
                </p>
              </CardHeader>
              <Image
                fill
                src="/standing.png"
                sizes="80vw"
                alt="Join us image"
                style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
              />
            </Card>
      </div>
      <div className="flex flex-col items-center justify-center p-10 gap-2 w-[60vw] h-[80vh]">
           <p className="text-2xl font-bold text-white">FAQ</p>
           <AccordianComponent />
      </div>
      <div>
        <p className="text-xs">Made by Imagine Software</p>
      </div>
    </div>
  );
}
