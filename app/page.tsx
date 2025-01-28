/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useCallback } from "react";
import { Monitor } from "lucide-react";
import { ResponsiveChart } from "@/components/ResponsiveChart";
import { FundDetails, fundsData } from "@/lib/data";
import { useFetchData } from "@/hooks/useFetchData";
import { formatUnits, getPnl, getRoi } from "@/lib/utils";
import { format } from "node:path";
import AboutArticle from "@/components/AboutArticle";
import OurVisionArticle from "@/components/OurVision";

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

interface WindowPosition {
  x: number;
  y: number;
}

interface DragState {
  isDragging: boolean;
  offset: { x: number; y: number };
}

export default function Dashboard() {
  const [isWindowOpen, setIsWindowOpen] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [showAboutWindow, setShowAboutWindow] = useState(false);
  const [showVisionWindow, setShowVisionWindow] = useState(false);
  const [showRecycleBin, setShowRecycleBin] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFund, setSelectedFund] = useState<FundDetails | null>(null);
  const [openWindows, setOpenWindows] = useState<string[]>(["dashboard"]);
  const [fundWindowMaximized, setFundWindowMaximized] = useState(false);

  const [aboutWindowMaximized, setAboutWindowMaximized] = useState(false);
  const [visionWindowMaximized, setVisionWindowMaximized] = useState(false);

  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const [windowPositions, setWindowPositions] = useState<{
    [key: string]: WindowPosition;
  }>({});

  const [dragStates, setDragStates] = useState<{
    [key: string]: DragState;
  }>({});

  const { assetPrices, totals } = useFetchData();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".start-button") && !target.closest(".start-menu")) {
        setStartMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const handleMouseDown = (
    windowId: string,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if ((e.target as HTMLElement).closest("button")) return;

    const windowElement = (e.target as HTMLElement).closest(
      ".window"
    ) as HTMLElement;
    if (!windowElement) return;

    const rect = windowElement.getBoundingClientRect();
    setDragStates((prev) => ({
      ...prev,
      [windowId]: {
        isDragging: true,
        offset: {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        },
      },
    }));
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      Object.entries(dragStates).forEach(([windowId, dragState]) => {
        if (!dragState.isDragging) return;

        setWindowPositions((prev) => ({
          ...prev,
          [windowId]: {
            x: e.clientX - dragState.offset.x,
            y: e.clientY - dragState.offset.y,
          },
        }));
      });
    },
    [dragStates]
  );

  const handleMouseUp = useCallback(() => {
    setDragStates((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        newState[key] = { ...newState[key], isDragging: false };
      });
      return newState;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const getWindowStyle = (windowId: string) => {
    const position = windowPositions[windowId];
    if (!position) return {};

    return {
      left: `${position.x}px`,
      top: `${position.y}px`,
      transform: "none",
    };
  };

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
  };

  const openCommingSoon = () => {
    setIsComingSoonOpen(true);
  };

  const closeFundDetails = (fundName: string) => {
    setOpenWindows(openWindows.filter((w) => w !== fundName));
    if (selectedFund?.name === fundName) {
      setSelectedFund(null);
    }
  };

  const handleStartMenuItemClick = (action: string) => {
    setStartMenuOpen(false);
    switch (action) {
      case "dashboard":
        setIsWindowOpen(true);
        setIsMinimized(false);
        break;
      case "about":
        setShowAboutWindow(true);
        break;
      case "vision":
        setShowVisionWindow(true);
        break;
      case "recycle":
        setShowRecycleBin(true);
        break;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="watermark">
        <img
          style={{ height: 100 }}
          src="/images/watermark.png"
          alt="Watermark"
        />
      </div>

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
            onDoubleClick={() => setShowAboutWindow(true)}
          >
            <img
              style={{ height: 64 }}
              src="/images/about-icon.png"
              alt="About Icon"
            />
            <span className="text-center">About</span>
          </div>
        </div>

        <div className="p-8">
          <div
            className="desktop-icon"
            onDoubleClick={() => setShowVisionWindow(true)}
          >
            <img
              style={{ height: 64 }}
              src="/images/vision-icon.png"
              alt="Vision Icon"
            />
            <span className="text-center">Our Vision</span>
          </div>
        </div>

        <div className="p-8">
          <div
            className="desktop-icon"
            onDoubleClick={() => setShowRecycleBin(true)}
          >
            <img
              style={{ height: 64 }}
              src="/images/bin-icon.png"
              alt="Recycle Bin"
            />
            <span className="text-center">Recycle Bin</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Window */}
      {isWindowOpen && !isMinimized && (
        <div
          className={`window w-[1024px] ${isMaximized ? "maximized" : ""}`}
          style={!isMaximized ? getWindowStyle("dashboard") : undefined}
        >
          <div
            className="window-title"
            onMouseDown={(e) => handleMouseDown("dashboard", e)}
          >
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
                <div className="metric-label">YTD PNL</div>
                <div className="metric-value">
                  {formatUnits(totals.totalPnL)}
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-label">TODAY'S PNL</div>
                <div className="metric-value">
                  {formatUnits(totals.todayPnl)}
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
                        </tr>
                      );
                    }
                    return (
                      <tr
                        key={fund.name}
                        className="hover:bg-blue-100 cursor-pointer"
                        onClick={() => openCommingSoon()}
                      >
                        <td className="table-cell">{fund.name}</td>
                        <td className="table-cell">***</td>
                        <td className="table-cell">***</td>
                        <td className="table-cell">***</td>
                        <td className="table-cell">***</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-3 gap-4"></div>
          </div>
        </div>
      )}

      {/* Fund Details Windows */}
      {selectedFund && openWindows.includes(selectedFund.name) && (
        <div
          className={`window w-[800px] ${
            fundWindowMaximized ? "maximized" : ""
          }`}
          style={
            !fundWindowMaximized ? getWindowStyle(selectedFund.name) : undefined
          }
        >
          <div
            className="window-title"
            onMouseDown={(e) => handleMouseDown(selectedFund.name, e)}
          >
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
            <div className="grid grid-cols-4 gap-4 mb-2">
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
                <div className="metric-label">YTD PNL</div>
                <div className="metric-value">
                  {formatUnits(totals.totalPnL)}
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-label">TODAY'S PNL</div>
                <div className="metric-value">
                  {formatUnits(totals.todayPnl)}
                </div>
              </div>
            </div>

            {/* Fund Categories */}
            {["HL Listed", "Pre-bonded", "Treasury"].map((category) => (
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
                            asset.currentValue > 0
                              ? asset.currentValue
                              : assetPrices?.[asset.symbol] === undefined
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
                                {roi.toFixed(2)}%
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* OnChain Wallets Section */}
            <div className="mt-2">
              <h3 className="text-sm font-semibold mb-1">OnChain Wallets</h3>
              <div className="text-xs text-gray-600">
                <span className="font-mono">
                  0xac5fFf941DFFbCb35171146e6232125EEd6a8829
                </span>
                <span className="font-mono">
                  , 0xFE490091ddf532334C9Ff1faB6f53C175e464d3c
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Window */}
      {showAboutWindow && (
        <div
          className="window w-[970px] h-[900]"
          style={getWindowStyle("about")}
        >
          <div
            className="window-title"
            onMouseDown={(e) => handleMouseDown("about", e)}
          >
            <div className="flex items-center gap-2">
              <img
                src="/images/about-icon.png"
                alt="About"
                className="h-4 w-4"
              />
              <span>About</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="close-button"
                onClick={() => setShowAboutWindow(false)}
              >
                <span className="window-button-icon">×</span>
              </button>
            </div>
          </div>
          <div className="window-content">
            <AboutArticle />
          </div>
        </div>
      )}

      {/* Vision Window */}
      {showVisionWindow && (
        <div
          className="window w-[970px] h-[900]"
          style={getWindowStyle("vision")}
        >
          <div
            className="window-title"
            onMouseDown={(e) => handleMouseDown("vision", e)}
          >
            <div className="flex items-center gap-2">
              <img
                src="/images/vision-icon.png"
                alt="Vision"
                className="h-4 w-4"
              />
              <span>Our Vision</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="close-button"
                onClick={() => setShowVisionWindow(false)}
              >
                <span className="window-button-icon">×</span>
              </button>
            </div>
          </div>
          <div className="window-content">
            <OurVisionArticle />
          </div>
        </div>
      )}

      {/* Recycle Bin Window */}
      {showRecycleBin && (
        <div className="window w-[500px]" style={getWindowStyle("recycle")}>
          <div
            className="window-title"
            onMouseDown={(e) => handleMouseDown("recycle", e)}
          >
            <div className="flex items-center gap-2">
              <img
                src="/images/bin-icon.png"
                alt="Recycle Bin"
                className="h-4 w-4"
              />
              <span>Recycle Bin</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="close-button"
                onClick={() => setShowRecycleBin(false)}
              >
                <span className="window-button-icon">×</span>
              </button>
            </div>
          </div>
          <div className="window-content">
            <p className="text-center text-gray-500 mt-8">
              Recycle Bin is empty
            </p>
          </div>
        </div>
      )}

      {/* Coming Soon Popup */}
      {isComingSoonOpen && (
        <div className="coming-soon-popup">
          <div className="window-title">
            <div className="flex items-center gap-2">
              <Monitor size={14} />
              <span>Coming Soon</span>
            </div>
            <button
              className="close-button"
              onClick={() => setIsComingSoonOpen(false)}
            >
              <span className="window-button-icon">×</span>
            </button>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Coming Soon!</p>
            <p className="text-sm text-gray-600">
              This fund is currently under reseach and will be available soon.
            </p>
          </div>
        </div>
      )}

      {/* Start Menu */}
      {startMenuOpen && (
        <div className="start-menu">
          <div className="start-menu-header">
            <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="start-menu-user">Hedgewater Fund</span>
          </div>
          <div className="start-menu-items">
            <button
              className="start-menu-item"
              onClick={() => handleStartMenuItemClick("dashboard")}
            >
              <img
                src="/images/dashboard-icon.png"
                alt="Dashboard"
                className="w-6 h-6"
              />
              Dashboard
            </button>
            <button
              className="start-menu-item"
              onClick={() => handleStartMenuItemClick("about")}
            >
              <img
                src="/images/about-icon.png"
                alt="About"
                className="w-6 h-6"
              />
              About
            </button>
            <button
              className="start-menu-item"
              onClick={() => handleStartMenuItemClick("vision")}
            >
              <img
                src="/images/vision-icon.png"
                alt="Vision"
                className="w-6 h-6"
              />
              Our Vision
            </button>
            <button
              className="start-menu-item"
              onClick={() => handleStartMenuItemClick("recycle")}
            >
              <img
                src="/images/bin-icon.png"
                alt="Recycle Bin"
                className="w-6 h-6"
              />
              Recycle Bin
            </button>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="taskbar">
        <button
          className="start-button"
          onClick={() => setStartMenuOpen(!startMenuOpen)}
        >
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
