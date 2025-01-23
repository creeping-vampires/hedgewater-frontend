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
