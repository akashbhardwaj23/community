import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmplexMono = IBM_Plex_Mono({
  variable: "--font-geist-ibmplexmono",
  subsets: ["latin"],
  weight : ['400', '500', '600']
})

export const metadata: Metadata = {
  title: "Community",
  description: "A small Community App for Developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ibmplexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
