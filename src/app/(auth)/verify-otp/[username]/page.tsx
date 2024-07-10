/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast, useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useState } from "react";
import { verifySchema } from "@/schemas/verifySchema";

function page() {
  const [otpVerifying, setOtpVerifying] = useState(false);
  const params = useParams<{ username: string }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
      ///is error ne mera kafi waqt research me lagwadiya
      // always give default value
      // error : unconrolled input
    },
  });

  console.log(params.username);

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    console.log("inside it");
    setOtpVerifying(true);
    try {
      const verifyUrl = `/api/verify-otp`;
      const response = await axios.post(verifyUrl, {
        username: params.username,
        verifyCode: data.code,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      console.log(response);
      router.replace("/sign-in");
    } catch (error) {
      console.log("Error in verifying otp up"); //TODO:
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failed to veriry otp",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setOtpVerifying(false);
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center
min-h-screen bg-gray-100"
    >
      <div className=" w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold *:tracking-tight lg:text-5xl mb-6">
            Verify OTP
          </h1>
          <p className="mb-4">Verification ensures it is really you</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input placeholder="Verify OTP" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                  This is your  OTP
                </FormDescription> */}
                </FormItem>
              )}
            />
            <Button type="submit" disabled={otpVerifying}>
              {otpVerifying ? (
                <>
                  <Loader className="mr-2 h-4 animate-spin" />
                  Verifying
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default page;
