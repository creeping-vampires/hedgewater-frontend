import React from "react";
import { Heart, Share2, MessageCircle, BarChart2 } from "lucide-react";

const OurVisionArticle = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm md:h-96 h-full overflow-y-auto md:mt-8">
      <h1 className="text-2xl font-bold mb-4">
        The Hyperliquid Revolution: Beyond the BNB Playbook
      </h1>

      <div className="flex gap-6 mb-6"></div>

      <div className="space-y-6 text-gray-800">
        <section>
          <h2 className="text-xl font-bold mb-3">The Wealth Effect Catalyst</h2>
          <p className="leading-relaxed">
            The crypto ecosystem has witnessed a recurring pattern: massive
            wealth creation events catalyze unprecedented innovation. The
            Hyperliquid airdrop of November 29th, 2024, distributing billions in
            value, mirrors two transformative moments in crypto history: BNB's
            rise in 2021 and Solana's resurgence in 2023.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">
            Historical Parallels: The BNB Blueprint
          </h2>
          <p className="leading-relaxed mb-6">
            In 2021, BNB's meteoric rise created a fertile ground for
            innovation. Projects like PancakeSwap (CAKE) achieved staggering
            returns, with nearly 90x growth from its accumulation range. This
            success wasn't isolated - Venus Protocol, AutoFarm, and Alpaca
            Finance followed similar trajectories, collectively generating
            billions in ecosystem value.
          </p>
          <div className="mb-8">
            <img
              src="/images/vision-img-1.jpeg"
              alt="BNB ecosystem growth illustration"
              className="w-full rounded-lg shadow-md"
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">The Solana Echo</h2>
          <p className="leading-relaxed">
            The pattern repeated with Solana's journey from $8 to $200, birthing
            innovative protocols like Jito, Jupiter, Kamino, and Drift. Each
            project didn't just capture value - they redefined what was possible
            in their respective domains.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Why Hyperliquid is BNB 2.0</h2>
          <p className="leading-relaxed mb-4">
            While Hyperliquid follows BNB's successful playbook, it introduces
            critical improvements:
          </p>
          <div className="space-y-4 pl-6">
            <div>
              <p className="font-semibold">Superior Architecture</p>
              <p className="text-gray-700">
                HyperBFT consensus enables 200ms transaction latency and
                100,000+ orders per second - dramatically outperforming BNB
                Chain's capabilities.
              </p>
            </div>
            <div>
              <p className="font-semibold">True Decentralization</p>
              <p className="text-gray-700">
                Unlike BNB's 21 validators, Hyperliquid's testnet already
                features 60+ validators, including industry leaders like Chorus
                One and Nansen.
              </p>
            </div>
            <div>
              <p className="font-semibold">Native Innovation</p>
              <p className="text-gray-700">
                The hybrid L1 + EVM architecture allows seamless interaction
                between DeFi protocols and native order books - something BNB
                Chain never achieved.
              </p>
            </div>
            <div>
              <p className="font-semibold">Builder-First Approach</p>
              <p className="text-gray-700">
                While BNB Chain primarily served Binance's interests,
                Hyperliquid is designed for developer innovation, with native
                support for advanced trading features and cross-protocol
                interactions.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">The EVM Exodus Opportunity</h2>
          <p className="leading-relaxed mb-4">
            The Ethereum ecosystem has seen limited breakthrough innovation
            recently, with only a handful of successful launches (Ethena,
            Morpho, Pendle). This vacuum creates perfect timing for Hyperliquid:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Thousands of EVM developers seeking fresh opportunities</li>
            <li>Mature tooling and infrastructure ready for deployment</li>
            <li>Significant capital waiting for compelling new protocols</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">
            Hedgewater's Strategic Position
          </h2>
          <p className="leading-relaxed mb-4">
            As an actively managed investment fund, Hedgewater Associates is
            positioning to capture this opportunity:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Target: Accumulating 1% positions in Hyperliquid's equivalent of
              CAKE, Venus, and Alpaca
            </li>
            <li>
              Strategy: Active position management based on liquidity, market
              depth, and sentiment
            </li>
            <li>
              Focus: Early identification of protocols leveraging Hyperliquid's
              unique features
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Looking Forward</h2>
          <p className="leading-relaxed">
            The next few months present an{" "}
            <span className="font-semibold">asymmetric opportunity</span> in the
            Hyperliquid ecosystem. With superior technology, proven market
            dynamics, and a wealth effect catalyst, Hyperliquid is positioned to
            not just replicate BNB's success but to establish a new paradigm for
            blockchain infrastructure.
          </p>

          <div className="mb-8 mt-4">
            <img
              src="/images/vision-img-2.jpeg"
              alt="BNB ecosystem growth illustration"
              className="w-full rounded-lg shadow-md"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default OurVisionArticle;
