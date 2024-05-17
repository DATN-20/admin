"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const UserChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null); // Specify the type of ref
  const chartInstanceRef = useRef<Chart>(); // Ref to store the chart instance

  useEffect(() => {
    if (!chartRef.current) return; // Check if chartRef.current is null

    const ctx = chartRef.current.getContext("2d");

    const apiData = {
      start_date: "2024-04-30T17:00:00.000Z",
      end_date: "2024-05-06T17:00:00.000Z",
      data: [
        {
          date: "2024-04-30T17:00:00.000Z",
          total: 0,
        },
        {
          date: "2024-05-01T17:00:00.000Z",
          total: 0,
        },
        {
          date: "2024-05-02T17:00:00.000Z",
          total: 0,
        },
        {
          date: "2024-05-03T17:00:00.000Z",
          total: 0,
        },
        {
          date: "2024-05-04T17:00:00.000Z",
          total: 1,
        },
        {
          date: "2024-05-05T17:00:00.000Z",
          total: 0,
        },
        {
          date: "2024-05-06T17:00:00.000Z",
          total: 0,
        },
      ],
    };
    const labels = apiData.data.map((entry) =>
      new Date(entry.date).toLocaleDateString("en-US")
    );
    const data = apiData.data.map((entry) => entry.total);

    // const data = {
    //   labels: ["January", "February", "March", "April", "May", "June"],
    //   datasets: [
    //     {
    //       label: "Total Users",
    //       data: [1200, 2100, 800, 1600, 900, 1700],
    //       backgroundColor: "rgba(54, 162, 235, 0.2)",
    //       borderColor: "rgba(54, 162, 235, 1)",
    //       borderWidth: 1,
    //     },
    //   ],
    // };

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Total Users",
          data: data,
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
  }, []);

  return (
    <div className="w-full h-64 flex justify-center">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default UserChart;
