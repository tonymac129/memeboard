import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Motion from "@/components/layout/Motion";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Home | MemeBoard",
  description:
    "Explore the trendiest memes, upload your own creations, chat with your friends, interact with the community, and more!",
  authors: [{ name: "tonymac129", url: "https://tonymac.net" }],
  openGraph: {
    title: "Home | MemeBoard",
    description:
      "Explore the trendiest memes, upload your own creations, chat with your friends, interact with the community, and more!",
    url: "https://memeboard-app.vercel.app",
    siteName: "MemeBoard",
    images: [
      {
        url: "/logo.png",
        width: 100,
        height: 100,
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class">
          <Nav />
          <Motion>
            {children}
            <Footer />
          </Motion>
        </ThemeProvider>
      </body>
    </html>
  );
}
