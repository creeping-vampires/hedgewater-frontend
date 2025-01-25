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
      {
        symbol: "VAPOR",
        quantity: 223820,
        initialValue: 10000,
        currentValue: 0,
        pnl: 0,
        roi: 0,
        category: "HL Listed",
        tokenAddress: "0xdb5190bea4b6ab178da0162420c93a73",
      },
      {
        symbol: "USDC",
        quantity: 30748,
        initialValue: 30748,
        currentValue: 30748,
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
        symbol: "----",
        quantity: 10000,
        initialValue: 10000,
        currentValue: 0,
        pnl: 0,
        roi: 0,
        category: "Treasury Swap",
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
