import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-white gap-10 min-h-screen">
      <div className="flex flex-col items-center justify-center p-10 gap-2 w-full h-[80vh]">
        <Image src="/Symbol-Brand-Colors.png" alt="MSU AI Club Logo" width={200} height={200} />
        <div className="w-full flex flex-row items-center justify-center lg:text-5xl md:text-3xl sm:text-lg whitespace-nowrap">
          <p>Welcome to the</p>
          <p className="font-bold ml-3">AI Club</p>
        </div>
        <p className="lg:text-base md:text-sm sm:text-xs">Exploring the boundless world of AI, together.</p>
      </div>
      <div className="flex flex-row items-center justify-between gap-2 w-full h-[80vh]">
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
    </div>
  );
}
