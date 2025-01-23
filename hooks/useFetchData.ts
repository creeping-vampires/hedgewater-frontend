"use client";

import { fundsData } from "@/lib/data";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { getPnl, getRoi } from "@/lib/utils";

export function useFetchData() {
  // asset symbol to info mapping
  const [data, setData] = useState<{ [key: string]: number }>({});

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
        fundsData[0].assets.forEach((asset, index) => {
          preparedData[asset.symbol] = results[index]?.midPx;
        });
        preparedData["USDC"] = 1;
        // todo: fix hfun token price in the future
        preparedData["HWTR"] = 0.1207504;

        setData(preparedData);

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

      console.log("total price ", price);
      const currentValue = price * asset.quantity;
      return acc + currentValue;
    }, 0);

    console.log("total current ", totalCurrentUSD);

    const totalPnL = getPnl(totalInvestedUSD, totalCurrentUSD);

    const totalROI = getRoi(totalInvestedUSD, totalCurrentUSD);

    return {
      totalAssets,
      totalInvestedUSD,
      totalCurrentUSD,
      totalPnL,
      totalROI,
    };
  }, [data]);

  return { assetPrices: data, totals };
}
