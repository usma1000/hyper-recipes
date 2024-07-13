import "~/styles/globals.css";
import "@uploadthing/react/styles.css";
import { Inter as FontSans } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ThemeProvider } from "~/components/theme-provider";
import { extractRouterConfig } from "uploadthing/server";
import { GeistSans } from "geist/font/sans";
import TopNav from "./_components/TopNav";
import { ourFileRouter } from "./api/uploadthing/core";
import { cn } from "~/lib/utils";
import Footer from "./_components/Footer";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Hyper Recipes",
  description: "Super charged recipes with more context",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <body
          className={cn(
            "flex min-h-screen flex-col font-sans antialiased",
            fontSans.variable,
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TopNav />
            <main className="mx-auto my-8 h-full max-w-3xl grow">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
