import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import TopNav from "./_components/TopNav";

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
    <html lang="en" className={`${GeistSans.variable}`}>
      <ClerkProvider>
        <body>
          <TopNav />
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
