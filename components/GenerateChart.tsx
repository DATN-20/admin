"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const GenerateChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null); // Specify the type of ref
  const chartInstanceRef = useRef<Chart>(); // Ref to store the chart instance

  useEffect(() => {
    if (!chartRef.current) return; // Check if chartRef.current is null

    const ctx = chartRef.current.getContext("2d");

    const data = {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Total Generation",
          data: [1200, 2100, 800, 1600, 900, 1700],
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };

    // Destroy previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart instance
    chartInstanceRef.current = new Chart(ctx!, {
      type: "line",
      data: data,
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
  }, []);

  return (
    <div className="w-full h-64 flex justify-center">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default GenerateChart;
