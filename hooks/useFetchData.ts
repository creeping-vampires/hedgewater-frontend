"use client";

import { fundsData } from "@/lib/data";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { getPnl, getRoi } from "@/lib/utils";

export function useFetchData() {
  // asset symbol to info mapping
  const [data, setData] = useState<{ [key: string]: number }>({});
  const [prevDayPrices, setPreviousDayPrices] = useState<{
    [key: string]: number;
  }>({});

  var body = JSON.stringify({
    type: "tokenDetails",
    tokenId: "0x55db85bd0938b111d0f78a98173fd99a",
  });

  var config = {
    method: "post",
    url: "https://api.hyperliquid.xyz/info",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const promises = fundsData[0].assets
          .filter((fund) => fund.tokenAddress)
          .map(async (asset) => {
            const body = JSON.stringify({
              type: "tokenDetails",
              tokenId: asset.tokenAddress,
            });
            return axios.post(config.url, body, {
              headers: config.headers,
            });
          });

        const responses = await Promise.all(promises);
        const results = responses.map((response) => response.data);

        const preparedData: any = {};
        const previousDayPrices: any = {};
        fundsData[0].assets.forEach((asset, index) => {
          preparedData[asset.symbol] = results[index]?.midPx;
          previousDayPrices[asset.symbol] = results[index]?.prevDayPx;
        });
        preparedData["USDC"] = 1;
        preparedData["Head (Airdrop)"] = 1;

        previousDayPrices["USDC"] = 1;

        // todo: fix hfun token price in the future
        preparedData["HWTR"] = 0.1207504;
        previousDayPrices["HWTR"] = 0.1023;

        preparedData["████ Private Sale"] = 1;
        previousDayPrices["████ Private Sale"] = 1;
        previousDayPrices["Head (Airdrop)"] = 1;

        setData(preparedData);

        setPreviousDayPrices(previousDayPrices);

        console.log("data is fetched ", results);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  //
  const totals = useMemo(() => {
    // calculate total assets
    // total asset count
    // total invested USD
    // total current USD
    // total PnL
    // total ROI

    const totalAssets = fundsData[0].assets.reduce((acc, asset) => acc + 1, 0);

    const totalInvestedUSD = fundsData[0].assets.reduce(
      (acc, asset) => acc + asset.initialValue,
      0
    );

    const totalCurrentUSD = fundsData[0].assets.reduce((acc, asset) => {
      const price = data[asset.symbol] === undefined ? 0 : data[asset.symbol];

      const currentValue = price * asset.quantity;
      return acc + currentValue;
    }, 0);

    const totalPreviousDayUSD = fundsData[0].assets.reduce((acc, asset) => {
      const price =
        prevDayPrices[asset.symbol] === undefined
          ? 0
          : prevDayPrices[asset.symbol];

      const currentValue = price * asset.quantity;
      return acc + currentValue;
    }, 0);

    const todayPnl = fundsData[0].assets.reduce((acc, asset) => {
      // if (asset.symbol === "HEAD (Airdrop)") {
      //   return acc + asset.currentValue;
      // }
      const prevPrice =
        asset.symbol === "HWTR"
          ? 1
          : prevDayPrices[asset.symbol] === undefined
          ? 0
          : prevDayPrices[asset.symbol];

      const currPrice =
        asset.symbol === "HWTR"
          ? 1
          : data[asset.symbol] === undefined
          ? 0
          : data[asset.symbol];

      const currentValue = (currPrice - prevPrice) * asset.quantity;
      const pnl = acc + currentValue;

      console.log("pnl ", {
        asset: asset.symbol,
        pnl,
      });
      return pnl;
    }, 0);

    console.log("total current ", {
      totalCurrentUSD,
      totalPreviousDayUSD,
      prevDayPrices,
      todayPnl,
    });

    const totalPnL = getPnl(totalInvestedUSD, totalCurrentUSD);

    const total1DPnL = getPnl(totalPreviousDayUSD, totalCurrentUSD);

    const totalROI = getRoi(totalInvestedUSD, totalCurrentUSD);

    return {
      totalAssets,
      totalInvestedUSD,
      totalCurrentUSD,
      totalPnL,
      totalROI,
      total1DPnL,
      todayPnl,
    };
  }, [data]);

  return { assetPrices: data, totals };
}
