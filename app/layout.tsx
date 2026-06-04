import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Home | MemeBoard",
  description:
    "Explore the trendiest memes, upload your own creations, and interact with the community!",
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
    >
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
