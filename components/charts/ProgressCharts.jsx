"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatINR } from "@/lib/utils";

export function WeightProgressChart({ data }) {
  const chartData = data && data.length > 0
    ? data.map((d) => ({
        date: new Date(d.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        weight: d.weightKg,
      }))
    : [
        { date: "15 Oct", weight: 82.0 },
        { date: "01 Nov", weight: 80.2 },
        { date: "15 Nov", weight: 78.5 },
      ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value) => [`${value} kg`, "Body Weight"]}
            contentStyle={{
              backgroundColor: "#18181b",
              borderRadius: "8px",
              border: "none",
              color: "#fff",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#000000"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#000" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueBarChart({ data }) {
  const defaultData = [
    { month: "Aug", revenue: 48000 },
    { month: "Sep", revenue: 62000 },
    { month: "Oct", revenue: 85000 },
    { month: "Nov", revenue: 112000 },
  ];

  const chartData = data || defaultData;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(val) => [formatINR(val), "Gross Revenue"]}
            contentStyle={{
              backgroundColor: "#18181b",
              borderRadius: "8px",
              border: "none",
              color: "#fff",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="revenue" fill="#18181b" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
