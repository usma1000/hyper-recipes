import "~/styles/globals.css";
import "@uploadthing/react/styles.css";
import { Inter as FontSans } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { GeistSans } from "geist/font/sans";
import TopNav from "./_components/TopNav";
import { ourFileRouter } from "./api/uploadthing/core";
import { cn } from "~/lib/utils";

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
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <body
          className={cn(
            "bg-background min-h-screen font-sans antialiased",
            fontSans.variable,
          )}
        >
          <TopNav />
          <main className="p-8">
            {children}
            {modal}
          </main>
          <div id="modal-root" />
        </body>
      </html>
    </ClerkProvider>
  );
}
