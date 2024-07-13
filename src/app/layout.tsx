import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/context/AuthProvider";
import Navbar from "@/components/Navbar";
// import { ThemeProvider } from "@/components/theme-proider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shadow Talk",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          {/* <ThemeProvider attribute="class" defaultTheme="system"> */}
          <Navbar />
          {children}
          <Toaster />
          {/* </ThemeProvider> */}
        </body>
      </AuthProvider>
    </html>
  );
}
