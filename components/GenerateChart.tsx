"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axiosInstance from "@/axiosInstance"; // Ensure you have the correct import for axiosInstance
import { Select } from "antd"; // Import Select from antd

interface GenerationChartProps {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
}
const GenerateChart: React.FC<GenerationChartProps> = ({ chartData }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart>();

  useEffect(() => {
    if (!chartRef.current || !chartData) return;

    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart instance
    chartInstanceRef.current = new Chart(ctx!, {
      type: "line",
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Clean up function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="w-full h-64 flex flex-col items-center">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default GenerateChart;
