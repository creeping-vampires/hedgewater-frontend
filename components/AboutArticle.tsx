import React from "react";
import { Heart, Share2, MessageCircle, BarChart2 } from "lucide-react";

const AboutArticle = () => {
  //   const StatItem = ({ icon: Icon, count }) => (
  //     <div className="flex items-center gap-2 text-gray-600">
  //       <Icon size={18} />
  //       <span>{count}</span>
  //     </div>
  //   );

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm h-96 overflow-y-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">
        First AI investment DAO on HyperLiquid
      </h1>

      <div className="flex gap-6 mb-6">
        {/* <StatItem icon={MessageCircle} count="18" />
        <StatItem icon={Share2} count="50" />
        <StatItem icon={Heart} count="261" />
        <StatItem icon={BarChart2} count="38K" /> */}
      </div>

      <div className="space-y-6 text-gray-800">
        <section>
          <p className="font-bold text-lg mb-4">
            TLDR: We deploy in Hyperliquid trenches frfr
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Executive Summary</h2>
          <p className="leading-relaxed">
            Hedge Water is an on-chain investment fund focused on Hyperliquid
            ecosystem. We leverage advanced AI agents for research & execution
            while maintaining full transparency in our investment process. Our
            fund capitalizes on Hyperliquid's unique position as the largest
            community-driven chain and potential successor to Binance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Fund Details</h2>
          <div className="space-y-2 pl-6">
            <p>
              <span className="font-semibold">Fund Manager:</span> George Zoros
            </p>
            <p>
              <span className="font-semibold">Investment Focus:</span>{" "}
              Hyperliquid Ecosystem
            </p>
            <p>
              <span className="font-semibold">Strategy Type:</span> AI-Driven
              Community Investment DAO
            </p>
            <p>
              <span className="font-semibold">Investment Approach:</span> Active
              Management via AI Agents
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Investment Strategy</h2>
          <h3 className="text-lg font-semibold mb-2">Philosophy</h3>
          <p className="mb-4">
            Our investment thesis is built on three core pillars:
          </p>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>
              Hyperliquid represents the largest community-driven chain,
              perfectly aligned with the rising trend of AI agents in crypto
            </li>
            <li>
              Hyperliquid is positioned as the legitimate successor to BNB and
              the only significant Binance competitor in the space
            </li>
            <li>
              The convergence of the largest community-run chain with the
              biggest community-driven movement creates unprecedented
              opportunity.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Investor Protection</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Full on-chain transparency</li>
            <li>Decentralized custody solutions</li>
            <li>No insider allocations or VC privileges</li>
            <li>
              Team OG Hyperliquid power users, experienced in hypurr fun
              trenches
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Legal Disclaimer</h2>
          <p className="leading-relaxed text-sm text-gray-600">
            This document is for informational purposes only and does not
            constitute an offer to sell or a solicitation of an offer to buy any
            securities. Investment in cryptocurrency funds involves substantial
            risk. Past performance is not indicative of future results.
          </p>
        </section>

        <section>
          <p className="text-sm text-gray-600 italic">
            Note: Our mandate focuses on empowering innovation while maintaining
            complete transparency in the investment process. As a
            community-driven initiative, we operate without traditional venture
            capital constraints or insider allocations, representing a pure
            decentralized finance movement.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutArticle;
