"use client";

import { useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useContainerWidth } from "@/hooks/useContainerWidth";

interface ChartProps {
  data: Array<{ date: string; value: number }>;
  color: string;
  height?: number;
}

export function ResponsiveChart({ data, color, height = 300 }: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);

  return (
    <div ref={containerRef} className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          style={{ background: 'white' }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#ccc"
            vertical={false}
          />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#666' }}
            tickLine={{ stroke: '#666' }}
          />
          <YAxis 
            domain={[-8, 8]} 
            ticks={[-8, -4, 0, 4, 8]}
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#666' }}
            tickLine={{ stroke: '#666' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}