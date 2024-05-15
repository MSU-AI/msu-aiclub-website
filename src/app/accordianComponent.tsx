"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";
import { faqContent } from "~/constants/faq";

export default function AccordianComponent() {
    return (
        <Accordion variant="light">
            {faqContent.map((item: any) => (
            <AccordionItem 
            key={item.question} 
            aria-label="Accordion 1" 
            title={item.question}
            classNames={{
                title: "text-white font-bold",
            }}
            >
                {item.answer}
            </AccordionItem>
            ))}
        </Accordion>
    )
}