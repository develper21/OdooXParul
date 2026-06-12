import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["400","500","600","700","800","900"] });

export const metadata: Metadata = {
  title: "Traveloop — Premium Travel Planning Platform",
  description: "Plan your perfect multi-city journey with Traveloop. Luxury travel management, AI itineraries & smart budget tracking.",
  keywords: ["travel", "trip planner", "itinerary", "luxury travel", "vacation planning"],
  openGraph: {
    title: "Traveloop — Premium Travel Planning",
    description: "Your cinematic travel planning experience",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0e1a" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
