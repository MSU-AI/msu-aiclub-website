"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { faqContent } from "~/constants/faq";

export default function AccordionComponent() {
  return (
    <div className="flex flex-col items-center justify-center p-10 gap-2 w-full">
      <p className="text-2xl font-bold text-white mb-6">FAQ</p>
      <Accordion type="single" collapsible className="w-full">
        {faqContent.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-white font-bold">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-300">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
