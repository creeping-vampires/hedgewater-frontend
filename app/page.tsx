/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useCallback } from "react";
import { Monitor } from "lucide-react";
import { ResponsiveChart } from "@/components/ResponsiveChart";
import { FundDetails, fundsData } from "@/lib/data";
import { useFetchData } from "@/hooks/useFetchData";
import { formatUnits, getPnl, getRoi } from "@/lib/utils";
import { format } from "node:path";

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
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCommingSoonOpen, setCommingSoon] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedFund, setSelectedFund] = useState<FundDetails | null>(null);
  const [openWindows, setOpenWindows] = useState<string[]>(["dashboard"]);
  const [fundWindowMaximized, setFundWindowMaximized] = useState(false);

  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const { assetPrices, totals } = useFetchData();

  console.log("data", { assetPrices });

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
    // setFundWindowMaximized(true);
  };

  const openCommingSoon = (fund: FundDetails) => {
    // setSelectedFund(fund);
    // if (!openWindows.includes(fund.name)) {
    //   setOpenWindows([...openWindows, fund.name]);
    // }
    setCommingSoon(true);
    setFundWindowMaximized(true);
  };

  const closeFundDetails = (fundName: string) => {
    setOpenWindows(openWindows.filter((w) => w !== fundName));
    if (selectedFund?.name === fundName) {
      setSelectedFund(null);
    }
  };

  const handleIconClick = (iconId: string) => {
    setSelectedIcon(iconId);
    if (iconId === "dashboard-icon") {
      setIsWindowOpen(true);
      setIsMinimized(false);
    } else if (iconId === "about") {
      // setShowAboutModal(true);
    } else if (iconId === "recycle") {
      // setShowRecycleBinModal(true);
    }
  };

  const desktopItems = [
    { id: "dashboard-icon.png", label: "Dashboard" },
    { id: "about-icon.png", label: "About" },
    { id: "vision-icon.png", label: "Our Vision" },
    { id: "bin-icon.png", label: "Recycle Bin" },
  ];

  return (
    <div className="min-h-screen">
      {/* Desktop Icons */}
      <div className="flex flex-col">
        <div className="p-8">
          <div
            className="desktop-icon"
            onDoubleClick={() => {
              setIsWindowOpen(true);
              setIsMinimized(false);
            }}
          >
            <img
              style={{ height: 64 }}
              src="/images/dashboard-icon.png"
              alt="Fund Icon"
            />
            <span className="text-center">Dashboard</span>
          </div>
        </div>

        <div className="p-8">
          <div
            className="desktop-icon"
            onDoubleClick={() => {
              // setIsWindowOpen(true);
              // setIsMinimized(false);
            }}
          >
            {/* <Monitor size={64} /> */}
            <img
              style={{ height: 64 }}
              src="/images/about-icon.png"
              alt="Fund Icon"
            />
            <span className="text-center">About</span>
          </div>
        </div>

        <div className="p-8">
          <div
            className="desktop-icon"
            onDoubleClick={() => {
              // setIsWindowOpen(true);
              // setIsMinimized(false);
            }}
          >
            {/* <Monitor size={64} /> */}
            <img
              style={{ height: 64 }}
              src="/images/vision-icon.png"
              alt="Fund Icon"
            />
            <span className="text-center">Our Vision</span>
          </div>
        </div>

        <div className="p-8">
          <div
            className="desktop-icon"
            onDoubleClick={() => {
              // setIsWindowOpen(true);
              // setIsMinimized(false);
            }}
          >
            {/* <Monitor size={64} /> */}
            <img
              style={{ height: 64 }}
              src="/images/bin-icon.png"
              alt="Fund Icon"
            />
            <span className="text-center">Recycle Bin</span>
          </div>
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
                <div className="metric-value">
                  {formatUnits(totals.totalCurrentUSD)}
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-label">TOTAL ASSETS</div>
                <div className="metric-value">{totals.totalAssets}</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">YTD ROI</div>
                <div className="metric-value">
                  {totals.totalROI.toFixed(2)}%
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-label">TODAY&apos;S PNL</div>
                <div className="metric-value">
                  {formatUnits(totals.totalPnL)}
                </div>
              </div>
            </div>

            {/* Fund Performance Table */}
            <div className="table-container mb-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">FUND</th>
                    <th className="table-header">Invested</th>
                    <th className="table-header">Current Value</th>
                    <th className="table-header">LAST MONTH</th>
                    <th className="table-header">PNL</th>
                    {/* <th className="table-header">LTD</th> */}
                  </tr>
                </thead>
                <tbody>
                  {fundsData.map((fund: any) => {
                    if (fund.name === "Genesis I") {
                      return (
                        <tr
                          key={fund.name}
                          className="hover:bg-blue-100 cursor-pointer"
                          onClick={() => openFundDetails(fund)}
                        >
                          <td className="table-cell">{fund.name}</td>
                          <td className="table-cell text-green-600">
                            {formatCurrency(totals.totalInvestedUSD)}
                          </td>
                          <td className="table-cell text-green-600">
                            {formatCurrency(totals.totalCurrentUSD)}
                          </td>
                          <td className="table-cell text-green-600">
                            {formatCurrency(totals.totalCurrentUSD)}
                          </td>
                          <td className="table-cell text-green-600">
                            {formatCurrency(totals.totalPnL)}
                          </td>
                          {/* <td className="table-cell text-green-500">+7.29%</td> */}
                        </tr>
                      );
                    }
                    return (
                      <tr
                        key={fund.name}
                        className="hover:bg-blue-100 cursor-pointer"
                        onClick={() => openCommingSoon(fund)}
                      >
                        <td className="table-cell">{fund.name}</td>
                        <td className="table-cell ">***</td>
                        <td className="table-cell ">***</td>
                        <td className="table-cell ">***</td>
                        <td className="table-cell ">***</td>
                        {/* <td className="table-cell ">***</td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Charts */}
            {/* <div className="grid grid-cols-2 gap-4 mb-4">
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
            </div> */}

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
          {/* <div className="status-bar">
            <div>Ready</div>
            <div suppressHydrationWarning>{currentTime.toLocaleString()}</div>
          </div> */}
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
                <div className="metric-value">
                  {formatUnits(totals.totalCurrentUSD)}
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-label">TOTAL ASSETS</div>
                <div className="metric-value">{totals.totalAssets}</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">YTD ROI</div>
                <div className="metric-value">
                  {totals.totalROI.toFixed(2)}%
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-label">TODAY&apos;S PNL</div>
                <div className="metric-value">
                  {formatUnits(totals.totalPnL)}
                </div>
              </div>
            </div>

            {/* Fund Categories */}
            {["HL Listed", "Pre-bonded", "Treasury Swap"].map((category) => (
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
                        <th className="table-header">INITIAL VALUE</th>
                        <th className="table-header">CURRENT VALUE</th>
                        <th className="table-header">PNL</th>
                        <th className="table-header">ROI</th>
                      </tr>
                    </thead>
                    {selectedFund.assets.filter(
                      (asset) => asset.category === category
                    ).length === 0 && (
                      <h3 className="text-lg text-center font-semibold mb-2 px-2 py-1 ">
                        No assets
                      </h3>
                    )}
                    <tbody>
                      {selectedFund.assets
                        .filter((asset) => asset.category === category)
                        .map((asset) => {
                          const currentValue =
                            assetPrices?.[asset.symbol] === undefined
                              ? 0
                              : asset.quantity * assetPrices[asset.symbol];

                          const pnl = getPnl(asset.initialValue, currentValue);
                          const roi = getRoi(asset.initialValue, currentValue);

                          return (
                            <tr key={asset.symbol}>
                              <td className="table-cell">{asset.symbol}</td>
                              <td className="table-cell">
                                {asset.quantity.toLocaleString()}
                              </td>
                              <td className="table-cell">
                                {formatCurrency(asset.initialValue)}
                              </td>

                              <td className="table-cell">
                                {formatCurrency(currentValue)}
                              </td>
                              <td
                                className={`table-cell ${
                                  pnl >= 0 ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {pnl >= 0 ? "+" : ""}
                                {formatCurrency(pnl)}
                              </td>
                              <td
                                className={`table-cell ${
                                  roi >= 0 ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {roi >= 0 ? "+" : ""}
                                {roi.toFixed(4)}%
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="status-bar">
            <div>Ready</div>
            <div suppressHydrationWarning>{currentTime.toLocaleString()}</div>
          </div> */}
        </div>
      )}

      {/* Comming Soon Window */}
      {isCommingSoonOpen && (
        <div className="window w-[500px] h-[300px]">
          <div className="window-title">
            <div className="flex items-center gap-2">
              <Monitor size={14} />
              <span className="text-sm">Comming Soon</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="minimize-button">
                <span className="window-button-icon">_</span>
              </button>
              <button className="maximize-button">
                <span className="window-button-icon">□</span>
              </button>
              <button
                className="close-button"
                onClick={() => setCommingSoon(false)}
              >
                <span className="window-button-icon">×</span>
              </button>
            </div>
          </div>
          <div className="window-content">
            <div className="text-center w-32 h-32 mx-auto">
              {/* <img
                src="/images/comming-soon.png"
                alt="Comming Soon"
                className="w-32 h-32 mx-auto"
              /> */}
              <h3 className="text-lg font-semibold mt-12 text-center">
                Coming Soon
              </h3>
              {/* <p className="text-sm text-gray-500">
                This feature is not available yet
              </p> */}
            </div>
          </div>
          <div className="status-bar">
            <div>Ready</div>
            <div suppressHydrationWarning>{currentTime.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Start Menu */}

      {/* Taskbar */}
      <div className="taskbar">
        <button
          className="start-button"
          onClick={(e) => {
            e.stopPropagation();
            setStartMenuOpen(!startMenuOpen);
          }}
        >
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
                src="/images/dashboard-icon.png"
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
