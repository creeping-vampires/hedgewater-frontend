import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HedgewaterDAO",
  description: `Hedgewater is an on-chain AI investment fund focused on Hyperliquid ecosystem. 

We leverage AI agents to drive both research and execution, ensuring a transparent and data-driven investment approach. Our fund is supported by a team of industry pioneers, who played a key role in shaping the foundations of DeFi, as well as experience investors in liquid markets.`,
  icons: "images/logo.jpeg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
