import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tayyab — Full-Stack Developer & Technical Founder",
  description:
    "Personal portfolio of Tayyab (ranatayyab.dev), full-stack engineer and technical founder building scalable web applications, distributed systems, and modern software.",
  keywords: [
    "Tayyab",
    "ranatayyab.dev",
    "Full-Stack Developer",
    "Technical Founder",
    "Software Engineer",
    "Next.js",
    "TypeScript",
    "React",
  ],
  authors: [{ name: "Tayyab", url: "https://ranatayyab.dev" }],
  openGraph: {
    title: "Tayyab — Full-Stack Developer & Technical Founder",
    description:
      "Engineering robust software, scalable web systems, and technical products.",
    url: "https://ranatayyab.dev",
    siteName: "ranatayyab.dev",
    type: "website",
  },
  icons: {
    icon: "/globe.svg",
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
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#0B0F19] text-[#F5F1E8] font-sans selection:bg-[#7A1F2B] selection:text-[#F5F1E8]"
      >
        {children}
      </body>
    </html>
  );
}
