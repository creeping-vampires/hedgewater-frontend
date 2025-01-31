"use client";

import { fundsData, sellOffData } from "@/lib/data";
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
        const assets: any[] = fundsData[0].assets.filter(
          (fund) => fund.tokenAddress
        );

        const promises = assets.map(async (asset) => {
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
        const addressToPrices: any = {};
        assets.forEach((asset: any, index: number) => {
          addressToPrices[asset.tokenAddress] = {
            midPx: results[index].midPx,
            prevDayPx: results[index].prevDayPx,
          };
        });

        const preparedData: any = {};
        const previousDayPrices: any = {};
        fundsData[0].assets.forEach((asset, index) => {
          if (!asset.tokenAddress) {
            return;
          }

          preparedData[asset.symbol] =
            addressToPrices[asset.tokenAddress].midPx;
          previousDayPrices[asset.symbol] =
            addressToPrices[asset.tokenAddress].prevDayPx;
        });
        preparedData["USDC"] = 1;
        preparedData["HEAD (Airdrop)"] = 3.8;

        previousDayPrices["USDC"] = 1;

        // todo: fix hfun token price in the future
        // preparedData["HWTR"] = 0.1207504;
        // previousDayPrices["HWTR"] = 0.1023;

        preparedData["████ Private Sale"] = 1;
        previousDayPrices["████ Private Sale"] = 1;
        previousDayPrices["HEAD (Airdrop)"] = 3.8;

        // console.log("prices fetched ", preparedData);
        setData(preparedData);

        setPreviousDayPrices(previousDayPrices);

        // console.log("data is fetched ", results);
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
      const prevPrice =
        prevDayPrices[asset.symbol] === undefined
          ? 0
          : prevDayPrices[asset.symbol];

      const currPrice =
        data[asset.symbol] === undefined ? 0 : data[asset.symbol];

      const currentValue = (currPrice - prevPrice) * asset.quantity;
      const pnl = acc + currentValue;

      // console.log("pnl ", {
      //   asset: asset.symbol,
      //   quantity: asset.quantity,
      //   prices: { prevPrice, currPrice },
      //   pnl,
      //   currentPnl: currentValue,
      // });
      return pnl;
    }, 0);

    const totalSellPnl = sellOffData.reduce((acc, asset) => {
      return acc + asset.pnl;
    }, 0);

    // console.log("total current ", {
    //   totalCurrentUSD,
    //   totalPreviousDayUSD,
    //   prevDayPrices,
    //   todayPnl,
    //   totalSellPnl,
    // });

    const totalPnL = getPnl(totalInvestedUSD, totalCurrentUSD);

    const total1DPnL = getPnl(totalPreviousDayUSD, totalCurrentUSD);

    const totalROI = getRoi(totalInvestedUSD, totalCurrentUSD);

    return {
      totalAssets,
      totalInvestedUSD,
      totalCurrentUSD,
      totalPnL: totalPnL + totalSellPnl,
      totalROI,
      total1DPnL,
      todayPnl,
    };
  }, [data]);

  return { assetPrices: data, totals };
}
