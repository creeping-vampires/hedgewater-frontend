import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HedgewaterDAO",
  description: `Vision & Mission
      Hedgewater aims to be the largest on-chain AI investment DAO, commanding a leading share in the Hyperliquid ecosystem. 
      We intend to

      Invest in scalable, high-potential projects at early stage that consistently outperform usual paradigm in the AI and Web3 space.
      
      Leverage the Hyperliquid ecosystem to achieve robust portfolio diversification, liquidity management and maximize returns. 
      
      Establish the FIRST decentralized governance model (DAO), empowering hedgewater partners to actively shape our investment strategy and decision-making.
      
      Build a Hype concentrated portfolio that holds a portfolio of market share leaders in Hyperliquid ecosystem. `,
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
