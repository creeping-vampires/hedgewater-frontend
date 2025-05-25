export interface Asset {
  symbol: string;
  quantity: number;
  currentValue: number;
  initialValue: number;
  pnl: number;
  roi: number;
  category: "HL Listed" | "Pre-bonded" | "Treasury";
  tokenAddress?: string | undefined; //
  isSold?: boolean;
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
      //   pnl: -7188,
      //   roi: 0,
      //   category: "HL Listed",
      //   tokenAddress: "0xdb5190bea4b6ab178da0162420c93a73",
      //   isSold: true,
      // },
      {
        symbol: "USDC",
        quantity: 11311,
        initialValue: 11311,
        currentValue: 11311,
        pnl: 0,
        roi: 0,
        category: "HL Listed",
      },
      {
        symbol: "HYPE",
        quantity: 975,
        initialValue: 0,
        currentValue: 0,
        pnl: 0,
        roi: 0,
        category: "HL Listed",
        tokenAddress: "0x0d01dc56dcaaca66ad901c959b4011ec",
      },
      {
        symbol: "PIP",
        quantity: 761.95,
        initialValue: 761.95,
        currentValue: 0,
        pnl: 0,
        roi: 0,
        category: "HL Listed",
        tokenAddress: "0xe85f43e1f91e3c8cdf3acbd7e0855b8e",
      },
      {
        symbol: "CATBAL",
        quantity: 689.33,
        initialValue: 689.33,
        currentValue: 0,
        pnl: 0,
        roi: 0,
        category: "HL Listed",
        tokenAddress: "0x38348c17e1a18559bbda232d22007695",
      },
      {
        symbol: "HWTR",
        quantity: 2623820,
        initialValue: 15100,
        currentValue: 0,
        pnl: 0,
        roi: 0,
        category: "Treasury",
        tokenAddress: "0xad426cf28a66dc0c8f3b931018ba9845",
      },
      {
        symbol: "Liminal USDC",
        quantity: 5000,
        initialValue: 5000,
        currentValue: 5000,
        pnl: 0,
        roi: 0,
        category: "Treasury",
        tokenAddress: "0xad426cf28a66dc0c8f3b931018ba9845",
      },
      // {
      //   symbol: "████ Private Sale",
      //   quantity: 10000,
      //   initialValue: 10000,
      //   currentValue: 10000,
      //   pnl: 0,
      //   roi: 0,
      //   category: "Treasury",
      // },
      {
        symbol: "HyperSwap Presale",
        quantity: 8000,
        initialValue: 8000,
        currentValue: 8000,
        pnl: 0,
        roi: 0,
        category: "Treasury",
      },
      // {
      //   symbol: "HEAD (Airdrop)",
      //   quantity: 9791, // 17960  .. 3.8 1.8
      //   initialValue: 0,
      //   currentValue: 37205,
      //   pnl: 0,
      //   roi: 0,
      //   category: "Pre-bonded",
      // },
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

export const sellOffData = [
  {
    asset: "VAPOR",
    quantity: 223820,
    pnl: -7188,
  },
];

export interface Partner {
  name: string;
  icon: string;
  website?: string;
  x?: string;
  dexscreener?: string;
}
export const PartnersList: Partner[] = [
  {
    name: "FLY",
    icon: "https://pbs.twimg.com/profile_images/1881002725946650624/5jRUF5t8_400x400.jpg",
    website: "https://hyperfly.sh/",
    x: "https://x.com/hyperflyai",
    dexscreener:
      "https://dexscreener.com/hyperliquid/0xdc64b4798a17b1ce5de41890ec5cc2af",
  },
  {
    name: "HEAD",
    icon: "https://pbs.twimg.com/profile_images/1872331464773443585/2hjruLgc_400x400.jpg",
    website: "https://www.headtohead.app/",
    x: "https://x.com/HeadtoHead_hl",
    dexscreener: "https://app.hypurr.fun/launch/9219",
  },
];
