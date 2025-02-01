/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useCallback } from "react";
import { Monitor } from "lucide-react";
import { FundDetails, fundsData } from "@/lib/data";
import { useFetchData } from "@/hooks/useFetchData";
import { formatUnits, getPnl, getRoi } from "@/lib/utils";
import AboutArticle from "@/components/AboutArticle";
import OurVisionArticle from "@/components/OurVision";
import Time from "@/components/Time";
import Link from "next/link";

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

  const [isFolderWindowOpen, setIsFolderWindowOpen] = useState(false);
  const [isFolderMaximized, setIsFolderMaximized] = useState(false);
  const [isFolderMinimized, setIsFolderMinimized] = useState(false);

  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [showAboutWindow, setShowAboutWindow] = useState(false);
  const [showVisionWindow, setShowVisionWindow] = useState(false);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [fundWindowMinimized, setFundWindowMinimized] = useState(false);

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
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".start-button") && !target.closest(".start-menu")) {
        setStartMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const toggleFolderMaximize = () => {
    setIsFolderMaximized(!isFolderMaximized);
    if (isFolderMaximized) setIsFolderMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMaximized) setIsMaximized(false);
  };

  const toggleFolderMinimize = () => {
    setIsFolderMinimized(!isFolderMinimized);
    if (isFolderMaximized) setIsMaximized(false);
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
          className="hidden md:block"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 p-4 md:p-8">
        <div
          className="desktop-icon"
          onDoubleClick={() => {
            setIsWindowOpen(true);
            setIsMinimized(false);
          }}
        >
          <img
            style={{ height: 40 }}
            className="md:h-16"
            src="/images/dashboard-icon.png"
            alt="Fund Icon"
          />
          <span className="text-center">Dashboard</span>
        </div>

        <div
          className="desktop-icon"
          onDoubleClick={() => setShowAboutWindow(true)}
        >
          <img
            style={{ height: 40 }}
            className="md:h-16"
            src="/images/about-icon.png"
            alt="About Icon"
          />
          <span className="text-center">About</span>
        </div>

        <div
          className="desktop-icon"
          onDoubleClick={() => setShowVisionWindow(true)}
        >
          <img
            style={{ height: 48 }}
            className="md:h-16"
            src="/images/vision-icon.png"
            alt="Vision Icon"
          />
          <span className="text-center">Our Vision</span>
        </div>

        <div
          className="desktop-icon"
          onDoubleClick={() =>
            window.open("https://x.com/HedgewaterDAO", "_blank")
          }
        >
          <img src="/images/x.png" alt="Vision Icon" />
          <span className="text-center">X</span>
        </div>

        <div
          className="desktop-icon"
          onDoubleClick={() =>
            window.open("https://gitbook.hedgewater.xyz/", "_blank")
          }
        >
          <img
            style={{ height: 48 }}
            className="md:h-16"
            src="/images/gitbook.svg"
            alt="Vision Icon"
          />
          <span className="text-center">Gitbook</span>
        </div>

        {/* <div
          className="desktop-icon"
          onDoubleClick={() => {
            setIsFolderWindowOpen(true);
            if (!openWindows.includes("folder")) {
              setOpenWindows([...openWindows, "folder"]);
            }
          }}
        >
          <img
            style={{ height: 32 }}
            className="md:h-16"
            src="/images/bin-icon.png"
            alt="Recycle Bin"
          />
          <span className="text-center">Partners</span>
        </div> */}
      </div>

      {isWindowOpen && !isMinimized && (
        <div
          className={`window w-full md:w-[1024px] h-[calc(100vh-40px)] md:h-auto overflow-auto ${
            isMaximized ? "maximized" : ""
          }`}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="metric-box">
                <div className="metric-label">TOTAL AUM</div>
                <div className="metric-value text-base md:text-lg">
                  {formatUnits(totals.totalCurrentUSD)}
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-label">TOTAL ASSETS</div>
                <div className="metric-value text-base md:text-lg">
                  {totals.totalAssets}
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-label">YTD PNL</div>
                <div className="metric-value text-base md:text-lg">
                  {formatUnits(totals.totalPnL)}
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-label">TODAY'S PNL</div>
                <div className="metric-value text-base md:text-lg">
                  {formatUnits(totals.todayPnl)}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="table-container mb-4 min-w-[600px]">
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
                              {formatCurrency(80000)}
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
            </div>

            <div className="grid grid-cols-3 gap-4"></div>
          </div>
        </div>
      )}

      {selectedFund &&
        openWindows.includes(selectedFund.name) &&
        !fundWindowMinimized && (
          <div
            className={`window w-full md:w-[800px] h-[calc(100vh-40px)] md:h-auto overflow-auto ${
              fundWindowMaximized ? "maximized" : ""
            }`}
            style={
              !fundWindowMaximized
                ? getWindowStyle(selectedFund.name)
                : undefined
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
                <button
                  className="minimize-button"
                  onClick={() => setFundWindowMinimized(true)}
                >
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
            <div className="window-content p-2 md:p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-2">
                <div className="metric-box">
                  <div className="metric-label text-xs md:text-sm">
                    TOTAL AUM
                  </div>
                  <div className="metric-value text-sm md:text-lg">
                    {formatUnits(totals.totalCurrentUSD)}
                  </div>
                </div>
                <div className="metric-box">
                  <div className="metric-label text-xs md:text-sm">
                    TOTAL ASSETS
                  </div>
                  <div className="metric-value text-sm md:text-lg">
                    {totals.totalAssets}
                  </div>
                </div>
                <div className="metric-box">
                  <div className="metric-label text-xs md:text-sm">YTD PNL</div>
                  <div className="metric-value text-sm md:text-lg">
                    {formatUnits(totals.totalPnL)}
                  </div>
                </div>
                <div className="metric-box">
                  <div className="metric-label text-xs md:text-sm">
                    TODAY'S PNL
                  </div>
                  <div className="metric-value text-sm md:text-lg">
                    {formatUnits(totals.todayPnl)}
                  </div>
                </div>
              </div>

              {["HL Listed", "Pre-bonded", "Treasury"].map((category) => (
                <div key={category} className="mb-4 md:mb-6">
                  <h3 className="text-sm font-semibold mb-2 px-2 py-1 bg-[#d4d0c8] border border-[#848484]">
                    {category}
                  </h3>
                  <div className="overflow-x-auto">
                    <div className="table-container min-w-[600px]">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="table-header text-xs md:text-sm">
                              ASSET
                            </th>
                            <th className="table-header text-xs md:text-sm">
                              QUANTITY
                            </th>
                            <th className="table-header text-xs md:text-sm">
                              INITIAL VALUE
                            </th>
                            <th className="table-header text-xs md:text-sm">
                              CURRENT VALUE
                            </th>
                            <th className="table-header text-xs md:text-sm">
                              PNL
                            </th>
                            <th className="table-header text-xs md:text-sm">
                              ROI
                            </th>
                          </tr>
                        </thead>
                        {selectedFund.assets.filter(
                          (asset) => asset.category === category
                        ).length === 0 && (
                          <tbody>
                            <tr>
                              <td colSpan={6}>
                                <h3 className="text-sm text-center font-semibold py-4">
                                  No assets
                                </h3>
                              </td>
                            </tr>
                          </tbody>
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

                              const pnl = getPnl(
                                asset.initialValue,
                                currentValue
                              );
                              const roi = getRoi(
                                asset.initialValue,
                                currentValue
                              );

                              return (
                                <tr key={asset.symbol}>
                                  <td className="table-cell text-xs md:text-sm">
                                    {asset.symbol}
                                  </td>
                                  <td className="table-cell text-xs md:text-sm">
                                    {asset.quantity.toLocaleString()}
                                  </td>
                                  <td className="table-cell text-xs md:text-sm">
                                    {formatCurrency(asset.initialValue)}
                                  </td>
                                  <td className="table-cell text-xs md:text-sm">
                                    {formatCurrency(currentValue)}
                                  </td>
                                  <td
                                    className={`table-cell text-xs md:text-sm ${
                                      pnl >= 0
                                        ? "text-green-500"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {pnl >= 0 ? "+" : ""}
                                    {formatCurrency(pnl)}
                                  </td>
                                  <td
                                    className={`table-cell text-xs md:text-sm ${
                                      roi >= 0
                                        ? "text-green-500"
                                        : "text-red-500"
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
                </div>
              ))}

              <div className="mt-4 md:mt-6 px-2">
                <h3 className="text-xs md:text-sm font-semibold mb-1">
                  OnChain Wallets
                </h3>
                <div className="text-xs text-gray-600 break-all">
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

      {/* Partners folder window  */}
      {isFolderWindowOpen && !isFolderMinimized && (
        <div
          className={`window w-full md:w-[1024px] h-[calc(100vh-40px)] md:h-auto overflow-auto ${
            isMaximized ? "maximized" : ""
          }`}
          style={!isFolderMaximized ? getWindowStyle("folder") : undefined}
        >
          <div
            className="window-title"
            onMouseDown={(e) => handleMouseDown("folder", e)}
          >
            <div className="flex items-center gap-2">
              <Monitor size={14} />
              <span className="text-sm">Fund Dashboard - Active</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="minimize-button"
                onClick={toggleFolderMinimize}
              >
                <span className="window-button-icon">_</span>
              </button>
              <button
                className="maximize-button"
                onClick={toggleFolderMaximize}
              >
                <span className="window-button-icon">□</span>
              </button>
              <button
                className="close-button"
                onClick={() => {
                  setIsFolderWindowOpen(false);

                  setOpenWindows(openWindows.filter((w) => w !== "folder"));
                }}
              >
                <span className="window-button-icon">×</span>
              </button>
            </div>
          </div>
          <div className="window-content">
            <div>Folder UI goes here</div>

            <div className="grid grid-cols-3 gap-4"></div>
          </div>
        </div>
      )}

      {showAboutWindow && (
        <div
          className="window w-full md:w-[970px] h-[calc(100vh-40px)] md:h-auto overflow-auto"
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

      {showVisionWindow && (
        <div
          className="window w-full md:w-[970px] h-[calc(100vh-40px)] md:h-auto overflow-auto"
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

      {showRecycleBin && (
        <div
          className="window w-full md:w-[500px] h-[calc(100vh-40px)] md:h-auto overflow-auto"
          style={getWindowStyle("recycle")}
        >
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
              This fund is currently under development and will be available
              soon.
            </p>
          </div>
        </div>
      )}

      {startMenuOpen && (
        <div className="start-menu w-full md:w-[250px]">
          <div className="start-menu-header">
            <img src="/images/logo.jpeg" alt="Logo" className="w-8 h-8" />
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

      <div className="taskbar h-10 md:h-12">
        <button
          className="start-button h-full"
          onClick={() => setStartMenuOpen(!startMenuOpen)}
        >
          <img
            className="h-5 md:h-6"
            src="/images/start-icon.png"
            alt="Start Icon"
          />
          <span className="hidden md:inline">Start</span>
        </button>

        <div className="flex-1 overflow-x-auto">
          {openWindows.map((window) => {
            if (window === "dashboard" && isWindowOpen) {
              return (
                <button
                  key={window}
                  className={`taskbar-item truncate ${
                    !isMinimized ? "active" : ""
                  }`}
                  onClick={() => {
                    if (isMinimized) {
                      setIsMinimized(false);
                    } else {
                      setIsMinimized(true);
                    }
                  }}
                >
                  <img
                    className="h-4 md:h-5"
                    src="/images/dashboard-icon.png"
                    alt="Fund Icon"
                  />
                  <span className="hidden md:inline">Fund Dashboard</span>
                </button>
              );
            } else if (window === "folder" && isFolderWindowOpen) {
              return (
                <button
                  key={window}
                  className={`taskbar-item truncate ${
                    !isFolderMinimized ? "active" : ""
                  }`}
                  onClick={() => {
                    if (isFolderMinimized) {
                      setIsFolderMinimized(false);
                    } else {
                      setIsFolderMinimized(true);
                    }
                  }}
                >
                  <img
                    className="h-4 md:h-5"
                    src="/images/folder.png"
                    alt="Fund Icon"
                  />
                  <span className="hidden md:inline">Folder</span>
                </button>
              );
            } else {
              return (
                <button
                  key={window}
                  className={`taskbar-item truncate ${
                    selectedFund?.name === window && !fundWindowMinimized
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    if (fundWindowMinimized) {
                      setFundWindowMinimized(false);
                    } else {
                      setSelectedFund(
                        fundsData.find((f) => f.name === window) || null
                      );
                    }
                  }}
                >
                  <Monitor className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden md:inline">{window}</span>
                </button>
              );
            }
          })}
        </div>

        <Time />
      </div>
    </div>
  );
}
