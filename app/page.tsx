"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Minus, Square, Monitor } from "lucide-react";
import { ResponsiveChart } from "@/components/ResponsiveChart";

interface Asset {
  symbol: string;
  quantity: number;
  currentValue: number;
  pnl: number;
  roi: number;
  category: "HL Spot" | "Pre-bonded" | "Treasury Swap";
}

interface FundDetails {
  name: string;
  assets: Asset[];
}

const fundsData: FundDetails[] = [
  {
    name: "Genesis I",
    assets: [
      {
        symbol: "AAPL",
        quantity: 15000,
        currentValue: 2745000,
        pnl: 45000,
        roi: 12.4,
        category: "HL Spot",
      },
      {
        symbol: "MSFT",
        quantity: 12500,
        currentValue: 4125000,
        pnl: 62500,
        roi: 15.2,
        category: "HL Spot",
      },
      {
        symbol: "GOOGL",
        quantity: 8000,
        currentValue: 2160000,
        pnl: -24000,
        roi: -1.1,
        category: "Pre-bonded",
      },
      {
        symbol: "NVDA",
        quantity: 5000,
        currentValue: 2450000,
        pnl: 125000,
        roi: 25.5,
        category: "Pre-bonded",
      },
      {
        symbol: "META",
        quantity: 10000,
        currentValue: 3450000,
        pnl: 26000,
        roi: 7.5,
        category: "Treasury Swap",
      },
      {
        symbol: "TSLA",
        quantity: 7500,
        currentValue: 1875000,
        pnl: -15000,
        roi: -0.8,
        category: "Treasury Swap",
      },
      {
        symbol: "AMZN",
        quantity: 6000,
        currentValue: 2340000,
        pnl: 34000,
        roi: 1.5,
        category: "HL Spot",
      },
      {
        symbol: "AMD",
        quantity: 20000,
        currentValue: 2800000,
        pnl: 80000,
        roi: 2.9,
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

const returnsData = [
  { date: "1/07", value: -5 },
  { date: "3/07", value: 2 },
  { date: "5/07", value: 8 },
  { date: "7/07", value: -3 },
  { date: "9/07", value: 5 },
  { date: "11/07", value: -1 },
];

const equityData = [
  { date: "1/07", value: -5 },
  { date: "3/07", value: 2 },
  { date: "5/07", value: 8 },
  { date: "7/07", value: -3 },
  { date: "9/07", value: 5 },
  { date: "11/07", value: -1 },
];

export default function Dashboard() {
  const [isWindowOpen, setIsWindowOpen] = useState(true);
  const [isMaximized, setIsMaximized] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedFund, setSelectedFund] = useState<FundDetails | null>(null);
  const [openWindows, setOpenWindows] = useState<string[]>(["dashboard"]);
  const [fundWindowMaximized, setFundWindowMaximized] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;

    const windowElement = (e.target as HTMLElement).closest(
      ".window"
    ) as HTMLElement;
    if (!windowElement) return;

    const rect = windowElement.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || isMaximized) return;

      const windowElement = document.querySelector(".window") as HTMLElement;
      if (!windowElement) return;

      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;

      windowElement.style.left = `${x}px`;
      windowElement.style.top = `${y}px`;
      windowElement.style.transform = "none";
    },
    [isDragging, isMaximized, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMaximized) setIsMaximized(false);
  };

  const toggleFundWindowMaximize = () => {
    setFundWindowMaximized(!fundWindowMaximized);
  };

  const openFundDetails = (fund: FundDetails) => {
    setSelectedFund(fund);
    if (!openWindows.includes(fund.name)) {
      setOpenWindows([...openWindows, fund.name]);
    }
    setFundWindowMaximized(true);
  };

  const closeFundDetails = (fundName: string) => {
    setOpenWindows(openWindows.filter((w) => w !== fundName));
    if (selectedFund?.name === fundName) {
      setSelectedFund(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Desktop Icons */}
      <div className="p-4">
        <div
          className="desktop-icon"
          onClick={() => {
            setIsWindowOpen(true);
            setIsMinimized(false);
          }}
        >
          {/* <Monitor size={64} /> */}
          <img
            style={{ height: 64 }}
            src="/images/desktop.png"
            alt="Fund Icon"
          />
          <span className="text-center">Hedgewater Fund</span>
        </div>
      </div>

      {/* Main Window */}
      {isWindowOpen && !isMinimized && (
        <div className={`window w-[1024px] ${isMaximized ? "maximized" : ""}`}>
          <div className="window-title" onMouseDown={handleMouseDown}>
            <div className="flex items-center gap-2">
              <Monitor size={14} />
              <span className="text-sm">Fund Dashboard - Active</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="minimize-button" onClick={toggleMinimize}>
                <span className="window-button-icon">_</span>
              </button>
              <button className="maximize-button" onClick={toggleMaximize}>
                <span className="window-button-icon">□</span>
              </button>
              <button
                className="close-button"
                onClick={() => setIsWindowOpen(false)}
              >
                <span className="window-button-icon">×</span>
              </button>
            </div>
          </div>
          <div className="window-content">
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="metric-box">
                <div className="metric-label">TOTAL AUM</div>
                <div className="metric-value">$125.7M</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">TOTAL ASSETS</div>
                <div className="metric-value">47</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">YTD ROI</div>
                <div className="metric-value">+18.5%</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">TODAY'S PNL</div>
                <div className="metric-value">$234.3K</div>
              </div>
            </div>

            {/* Fund Performance Table */}
            <div className="table-container mb-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">FUND</th>
                    <th className="table-header">MTD</th>
                    <th className="table-header">LAST MONTH</th>
                    <th className="table-header">YTD</th>
                    <th className="table-header">LTD</th>
                  </tr>
                </thead>
                <tbody>
                  {fundsData.map((fund) => (
                    <tr
                      key={fund.name}
                      className="hover:bg-blue-100 cursor-pointer"
                      onClick={() => openFundDetails(fund)}
                    >
                      <td className="table-cell">{fund.name}</td>
                      <td className="table-cell text-red-500">-1.35%</td>
                      <td className="table-cell text-red-500">-1.35%</td>
                      <td className="table-cell text-red-500">-1.35%</td>
                      <td className="table-cell text-green-500">+7.29%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="chart-container">
                <div className="chart-title">Returns Since Inception</div>
                <ResponsiveChart
                  data={returnsData}
                  color="#4338ca"
                  height={200}
                />
              </div>
              <div className="chart-container">
                <div className="chart-title">Firm Equity and Leverage</div>
                <ResponsiveChart
                  data={equityData}
                  color="#059669"
                  height={200}
                />
              </div>
            </div>

            {/* Category Mix */}
            <div className="grid grid-cols-3 gap-4">
              <div className="category-box">
                <div className="text-sm font-medium">ARM</div>
                <div className="text-xl font-bold">00.00%</div>
              </div>
              <div className="category-box">
                <div className="text-sm font-medium">Floater</div>
                <div className="text-xl font-bold">00.00%</div>
              </div>
              <div className="category-box">
                <div className="text-sm font-medium">Fixed</div>
                <div className="text-xl font-bold">00.00%</div>
              </div>
            </div>
          </div>
          <div className="status-bar">
            <div>Ready</div>
            <div suppressHydrationWarning>{currentTime.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Fund Details Windows */}
      {selectedFund && openWindows.includes(selectedFund.name) && (
        <div
          className={`window w-[800px] ${
            fundWindowMaximized ? "maximized" : ""
          }`}
        >
          <div className="window-title">
            <div className="flex items-center gap-2">
              <Monitor size={14} />
              <span className="text-sm">
                {selectedFund.name} - Fund Details
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="minimize-button">
                <span className="window-button-icon">_</span>
              </button>
              <button
                className="maximize-button"
                onClick={toggleFundWindowMaximize}
              >
                <span className="window-button-icon">□</span>
              </button>
              <button
                className="close-button"
                onClick={() => closeFundDetails(selectedFund.name)}
              >
                <span className="window-button-icon">×</span>
              </button>
            </div>
          </div>
          <div className="window-content">
            {/* Fund Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="metric-box">
                <div className="metric-label">TOTAL AUM</div>
                <div className="metric-value">$125.7M</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">YTD ROI</div>
                <div className="metric-value">+18.5%</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">TODAY'S PNL</div>
                <div className="metric-value">$234.3K</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">TOTAL ASSETS</div>
                <div className="metric-value">47</div>
              </div>
            </div>

            {/* Fund Categories */}
            {["HL Spot", "Pre-bonded", "Treasury Swap"].map((category) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold mb-2 px-2 py-1 bg-[#d4d0c8] border border-[#848484]">
                  {category}
                </h3>
                <div className="table-container">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="table-header">ASSET</th>
                        <th className="table-header">QUANTITY</th>
                        <th className="table-header">CURRENT VALUE</th>
                        <th className="table-header">24H PNL</th>
                        <th className="table-header">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFund.assets
                        .filter((asset) => asset.category === category)
                        .map((asset) => (
                          <tr key={asset.symbol}>
                            <td className="table-cell">{asset.symbol}</td>
                            <td className="table-cell">
                              {asset.quantity.toLocaleString()}
                            </td>
                            <td className="table-cell">
                              {formatCurrency(asset.currentValue)}
                            </td>
                            <td
                              className={`table-cell ${
                                asset.pnl >= 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {asset.pnl >= 0 ? "+" : ""}
                              {formatCurrency(asset.pnl)}
                            </td>
                            <td
                              className={`table-cell ${
                                asset.roi >= 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {asset.roi >= 0 ? "+" : ""}
                              {asset.roi}%
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
          <div className="status-bar">
            <div>Ready</div>
            <div suppressHydrationWarning>{currentTime.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="taskbar">
        <button className="start-button">
          {/* <Monitor size={20} /> */}
          <img
            style={{ height: 20 }}
            src="/images/start-icon.png"
            alt="Start Icon"
          />
          Start
        </button>
        {openWindows.map((window) =>
          window === "dashboard" && isWindowOpen ? (
            <button
              key={window}
              className={`taskbar-item ${!isMinimized ? "active" : ""}`}
              onClick={() => {
                if (isMinimized) {
                  setIsMinimized(false);
                } else {
                  setIsMinimized(true);
                }
              }}
            >
              {/* <Monitor size={16} /> */}
              <img
                style={{ height: 16 }}
                src="/images/desktop.png"
                alt="Fund Icon"
              />
              Fund Dashboard
            </button>
          ) : (
            window !== "dashboard" && (
              <button
                key={window}
                className="taskbar-item"
                onClick={() =>
                  setSelectedFund(
                    fundsData.find((f) => f.name === window) || null
                  )
                }
              >
                <Monitor size={16} />
                {window}
              </button>
            )
          )
        )}
        <div className="flex-1" />
        <div className="clock" suppressHydrationWarning>
          {formatTime(currentTime)}
        </div>
      </div>
    </div>
  );
}
