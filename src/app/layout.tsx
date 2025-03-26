import "~/styles/globals.css";
import "@uploadthing/react/styles.css";
import { Inter as FontSans } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ThemeProvider } from "~/components/theme-provider";
import { extractRouterConfig } from "uploadthing/server";
import TopNav from "./_components/TopNav";
import { ourFileRouter } from "./api/uploadthing/core";
import { cn } from "~/lib/utils";
import Footer from "./_components/Footer";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Hyper Recipes",
  description: "Super charged recipes with more context",
  icons: [{ rel: "icon", url: "/favicon-32x32.png", sizes: "32x32" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        style={{ colorScheme: "light" }}
        className={`${fontSans.variable} light`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <body
          className={cn(
            "flex min-h-screen flex-col font-sans antialiased dark:bg-slate-950",
            fontSans.variable,
          )}
        >
          <ThemeProvider attribute="class">
            <TopNav />
            <main className="container h-full grow py-8">{children}</main>
            <Toaster />
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
