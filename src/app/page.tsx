"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className=" w-full flex flex-col items-center">
          <h1 className="m-0 max-w-[30ch] text-balance text-6xl text-black font-extrabold text-center mb-4">
            Voices in the Shadows
          </h1>
          <p className="m-0 text-balance text-2xl font-medium text-center opacity-75">
            Join Shadow Talk to give and receive anonymous feedback, uncovering
            the layers of every topic
          </p>
          <div className="w-full max-w-6xl mt-16">
            <Carousel
              plugins={[plugin.current]}
              className="w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent className="flex items-center justify-center">
                {feedbacks.map((feedback, index) => (
                  <CarouselItem
                    key={feedback.id}
                    className="flex items-center justify-center"
                  >
                    <div className="p-4 w-full max-w-lg">
                      <Card className="h-full flex flex-col justify-between items-center">
                        <CardContent className="text-center mt-2">
                          <span className="text-md font-semibold opacity-50">
                            {feedback.anonymousName}
                          </span>
                        </CardContent>
                        <CardContent className="text-center mb-4 p-4">
                          <span className="text-xl font-normal  opacity-75">
                            {feedback.feedback}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
        <div className="mt-16 w-1/2">
          <p className="m-0  text-balance text-lg text-black text-center opacity-50">
            Frequently asked questions?
          </p>

          <Accordion type="single" collapsible className="mt-7">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>

      <footer className="bg-gray-950 text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold">Shadow Talk</span>
          </div>
          <div>
            <p className="text-sm">
              Join Shadow Talk for anonymous feedback and open conversations.
            </p>
            <p className="text-sm mt-2">
              © {new Date().getFullYear()} Shadow Talk. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

const feedbacks = [
  {
    id: 1,
    feedback:
      "This platform has really opened up new perspectives for me. Love the anonymity!",
    anonymousName: "Ironman",
  },
  {
    id: 11,
    feedback:
      "This platform has really opened up new perspectives for me. Love the anonymity!",
    anonymousName: "Ironman",
  },
  {
    id: 33,
    feedback:
      "This platform has really opened up new perspectives for me. Love the anonymity!",
    anonymousName: "Ironman",
  },
  {
    id: 44,
    feedback:
      "This platform has really opened up new perspectives for me. Love the anonymity!",
    anonymousName: "Ironman",
  },
  {
    id: 55,
    feedback:
      "This platform has really opened up new perspectives for me. Love the anonymity!",
    anonymousName: "Ironman",
  },
  {
    id: 2,
    feedback:
      "Shadow Talk is a great way to get honest feedback without any bias. Highly recommend!",
    anonymousName: "Batman",
  },

  {
    id: 3,
    feedback:
      "Being able to share my thoughts anonymously has been a game changer. Kudos to Shadow Talk!",
    anonymousName: "Thanos",
  },
  {
    id: 4,
    feedback:
      "I appreciate the honest and constructive feedback I've received here. It's invaluable.",
    anonymousName: "SilentCritic",
  },
  {
    id: 5,
    feedback:
      "The anonymous feature makes it easier to speak my mind without fear of judgment. Great platform!",
    anonymousName: "HiddenGems",
  },
];
const faqs = [
  {
    id: 1,
    question: "What is Shadow Talk?",
    answer:
      "Shadow Talk is an anonymous feedback platform where users can give and receive constructive feedback without revealing their identity. It’s a space for open, honest, and impactful conversations.",
  },
  {
    id: 2,
    question: "How does anonymity work on Shadow Talk?",
    answer:
      "We prioritize your privacy. When you give or receive feedback, your identity remains hidden. This ensures that feedback is genuine and free from biases, fostering a safe environment for all users.",
  },
  {
    id: 3,
    question: "Why should I use Shadow Talk for feedback?",
    answer:
      "Shadow Talk allows you to receive candid feedback that you might not get in a face-to-face interaction. It's a powerful tool for personal growth, gaining new perspectives, and improving your communication skills.",
  },

  {
    id: 4,
    question: "Is Shadow Talk free to use?",
    answer:
      "Absolutely! Shadow Talk is free to use. We believe that everyone should have access to honest feedback and meaningful conversations without any barriers.",
  },

  {
    id: 6,
    question: "What kind of feedback can I give or receive on Shadow Talk?",
    answer:
      "You can give or receive feedback on any topic, whether it's personal growth, professional development, or specific projects. The platform is versatile and caters to a wide range of feedback needs.",
  },
  {
    id: 7,
    question: "How do I get started with Shadow Talk?",
    answer:
      "Getting started is easy! Simply sign up with your email, create a profile, and start giving or receiving anonymous feedback.To give feedback paste the link of user profile in the search bar and press enter and there you go.",
  },
];
