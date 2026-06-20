import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://systems-architecture.vercel.app"),
  title: "Systems Architecture",
  description:
    "Architecture decisions at scale — analytics platform migration and cloud infrastructure evaluation by Wahid Tawsif Ratul, Product Analytics Engineer at a B2B experimentation and digital-experience platform.",
  openGraph: {
    title: "Systems Architecture",
    description:
      "Architecture decisions at scale — analytics platform migration and cloud infrastructure evaluation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
