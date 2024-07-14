/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boolean, z } from "zod";
import { toast } from "@/components/ui/use-toast";

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
      <div className="flex flex-col gap-4 w-1/2  justify-center ">
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
      </div>
    </div>
  );
}

export default page;
