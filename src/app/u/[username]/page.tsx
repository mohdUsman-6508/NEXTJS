/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boolean, z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

function page() {
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const params = useParams<{ username: string }>();
  const [isAcceptingMessage, setIsAcceptingMessage] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    const isUserAcceptingMessages = async () => {
      try {
        const statusCheckUrl = `/api/get-user-message-status?username=${params.username}`;
        const response = await axios.get(statusCheckUrl);
        setIsAcceptingMessage(response.data.isAcceptingMessage);
        toast({
          title: "Message",
          description: response.data.message,
        });
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.message;
        return toast({
          title: "Failed to send message",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };
    isUserAcceptingMessages();
  }, [params.username]);

  async function onSubmit(data: z.infer<typeof messageSchema>) {
    if (isAcceptingMessage) {
      setIsSendingMessage(true);
      try {
        const sendMessageUrl = "/api/send-message";
        const response = await axios.post(sendMessageUrl, {
          username: params.username,
          content: data.content,
        });

        if (response.data.success == true) {
          toast({
            title: "Success",
            description: "Message sent successfully",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.message;
        toast({
          title: "Failed to send message",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsSendingMessage(false);
      }
    } else {
      return toast({
        title: "Bad Request",
        description: "User is not accepting message",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col gap-5 items-center mt-14 ">
      <div className="flex flex-col gap-4 w-3/5  justify-center ">
        <div className="  text-center font-bold text-5xl">
          Public Profile Link
        </div>
        <div className="mt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" opacity-75 text-md font-semibold mb-3">
                      Send Anonymous message to @{params.username}
                    </FormLabel>
                    <FormControl className=" h-20 flex items-start justify-start">
                      <Textarea
                        placeholder="Start writing your anonymous message here"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  disabled={!isAcceptingMessage || isSendingMessage}
                >
                  {isSendingMessage ? (
                    <>
                      <Loader className="animate-spin mr-2 h-4" /> Sending
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <Separator className="mt-5" />
        <div className="mt-8">
          <Badge variant="default">Message Suggestions</Badge>
        </div>
        <div className="mt-2 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                You can start giving feedback using these messages
              </CardDescription>
            </CardHeader>
            <Separator />
            {messages.map((message) => (
              <CardContent key={message.id}>
                <p className="p-3 font-semibold opacity-80">
                  {message.message}
                </p>
                <Separator />
              </CardContent>
            ))}
            <CardFooter>
              <p className="text-xs opacity-50">
                Let&apos; give an honest feedback.
              </p>
            </CardFooter>
          </Card>
        </div>
        <div className="mt-10 text-2xl font-bold text-center mb-4">
          <p>Get Honest Insights</p>
          <p className="text-2xl font-bold">Receive Anonymous Feedback Now!</p>
        </div>
        <Link
          href="/sign-up"
          className="flex items-center justify-center mb-10"
        >
          <Button>Signup</Button>
        </Link>
      </div>
    </div>
  );
}

export default page;

const messages = [
  // {
  //   id: 1,
  //   message: "What's a book or movie that had a significant impact on you?",
  // },
  // {
  //   id: 2,
  //   message:
  //     "If you could travel anywhere in the world right now, where would you go and why?",
  // },
  { id: 3, message: "What's a skill you've always wanted to learn and why?" },
  // {
  //   id: 4,
  //   message:
  //     "If you could have any superpower for a day, what would it be and how would you use it?",
  // },
  // { id: 5, message: "What's a hobby you've recently started?" },
  // {
  //   id: 6,
  //   message:
  //     "If you could have dinner with any historical figure, who would it be?",
  // },
  { id: 7, message: "What's a simple thing that makes you happy?" },
  // { id: 8, message: "What's the most interesting place you've ever visited?" },
  {
    id: 9,
    message: "If you could time travel to any era, when would you go and why?",
  },
  { id: 10, message: "What's the best piece of advice you've ever received?" },
  // {
  //   id: 11,
  //   message:
  //     "If you could instantly master any musical instrument, which one would you choose?",
  // },
  // { id: 12, message: "What's a project or goal you're currently working on?" },
];
