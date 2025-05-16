import type {Metadata} from 'next';
import { Inter as FontSans } from "next/font/google" 
// Removed: import localFont from "next/font/local" 

import './globals.css';
import { cn } from "@/lib/utils"


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Removed: GeistMono font definition
// const fontMono = localFont({
//   src: [
//     {
//       path: "../fonts/GeistMono-Regular.woff2",
//       weight: "400",
//       style: "normal",
//     },
//     {
//       path: "../fonts/GeistMono-Medium.woff2",
//       weight: "500",
//       style: "normal",
//     },
//     {
//       path: "../fonts/GeistMono-Bold.woff2",
//       weight: "700",
//       style: "normal",
//     },
//   ],
//   variable: "--font-mono",
// })


export const metadata: Metadata = {
  title: 'GeminiFlow',
  description: 'Chat with Gemini AI seamlessly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
          // Removed: fontMono.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
