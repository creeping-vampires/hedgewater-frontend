export interface Asset {
  symbol: string;
  quantity: number;
  currentValue: number;
  initialValue: number;
  pnl: number;
  roi: number;
  category: "HL Listed" | "Pre-bonded" | "Treasury Swap";
  tokenAddress?: string | undefined; //
}

export interface FundDetails {
  name: string;
  assets: Asset[];
}

export const fundsData: FundDetails[] = [
  {
    name: "Genesis I",
    assets: [
      {
        symbol: "FLY",
        quantity: 2771765,
        initialValue: 13000,
        currentValue: 0,
        pnl: 0,
        roi: 0,
        category: "HL Listed",
        tokenAddress: "0x55db85bd0938b111d0f78a98173fd99a",
      },
      // {
      //   symbol: "VAPOR",
      //   quantity: 223820,
      //   initialValue: 10000,
      //   currentValue: 0,
      //   pnl: 0,
      //   roi: 0,
      //   category: "HL Listed",
      //   tokenAddress: "0xdb5190bea4b6ab178da0162420c93a73",
      // },
      {
        symbol: "USDC",
        quantity: 34712,
        initialValue: 34712,
        currentValue: 34712,
        pnl: 0,
        roi: 0,
        category: "HL Listed",
      },
      {
        symbol: "HWTR",
        quantity: 2623820,
        initialValue: 15100,
        currentValue: 0,
        pnl: 0,
        roi: 0,
        category: "Treasury Swap",
      },
      {
        symbol: "████ Private Sale",
        quantity: 10000,
        initialValue: 10000,
        currentValue: 10000,
        pnl: 0,
        roi: 0,
        category: "Treasury Swap",
      },
      {
        symbol: "HEAD (Airdrop)",
        quantity: 17300,
        initialValue: 0,
        currentValue: 37887,
        pnl: 0,
        roi: 0,
        category: "Pre-bonded",
      },
    ],
  },
  {
    name: "Fund 2",
    assets: [],
  },
  {
    name: "Fund 3",
    assets: [],
  },
];
