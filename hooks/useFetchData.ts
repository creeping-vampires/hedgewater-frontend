"use client";

import { fundsData } from "@/lib/data";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useFetchData() {
  // asset symbol to info mapping
  const [data, setData] = useState({});

  const dexscreenerAPI = ``;

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
        preparedData["HWTR"] = 12.07504;

        setData(preparedData);

        console.log("data is fetched ", results);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  return data;
}
