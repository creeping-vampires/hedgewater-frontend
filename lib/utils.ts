import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPnl(initialValue: number, currentValue: number) {
  if (!initialValue) {
    return 0;
  }
  return currentValue - initialValue;
}

export function getRoi(initialValue: number, currentValue: number) {
  if (!initialValue) {
    return 0;
  }
  return ((currentValue - initialValue) / initialValue) * 100;
}

// function to convert value into K , M , B

export function formatUnits(value: number) {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(2) + "B";
  }
  if (value >= 1e6) {
    return (value / 1e6).toFixed(2) + "M";
  }
  if (value >= 1e3) {
    return (value / 1e3).toFixed(2) + "K";
  }
  return value.toFixed(2);
}
