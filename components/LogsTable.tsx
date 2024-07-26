"use client";

import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { ColumnType } from "antd/es/table";
import { LogMonitoring } from "@/types/LogMonitoring";
import { useGetLoggingApiQuery } from "@/services/log-monitoring/logMonitoringApi";

function LogsTable() {
  const [dataSource, setDataSource] = useState<LogMonitoring.ApiLogJson[]>([]);
  const [limit, setLimit] = useState<number>(6);
  const [page, setPage] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [endpoint, setEndpoint] = useState<string>("/generate-image/text-to-image");
  const endpoints = [
    {
        endpoint: "/generate-image/image-to-image", displayText: "Image to Image"
    },
    {
        endpoint: "/generate-image/text-to-image", displayText: "Text to Image"
    },
    {
        endpoint: "/generate-image/image-by-images-style", displayText: "Generate with Style"
    },
  ];
  const { data: dataFromApi } = useGetLoggingApiQuery({
    limit: limit,
    page: page,
    startDate: startDate,
    endDate: endDate,
    endpoint: AcceptanceEndpoint.TEXT_TO_IMAGE
  });
  
  useEffect(() => {
    // Fetch data from API and set it to state
    setDataSource(dataFromApi.data);
  }, []);

  const columns: ColumnType<LogEntry>[] = [
    {
      key: "user_id",
      title: "User ID",
      dataIndex: "user_id",
    },
    {
      key: "requested_at",
      title: "Requested At",
      dataIndex: "requested_at",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      key: "endpoint",
      title: "Endpoint",
      dataIndex: "endpoint",
    },
    {
      key: "severity",
      title: "Severity",
      dataIndex: "severity",
    },
    {
      key: "message",
      title: "Message",
      dataIndex: "message",
    },
    {
      key: "file",
      title: "File",
      dataIndex: "file",
    },
  ];

  return (
    <div className="App p-12">
      <header className="App-header">
        <div className="mb-10 font-bold text-3xl">Logs Monitoring</div>
        <Table columns={columns} dataSource={dataSource} rowKey="user_id" />
      </header>
    </div>
  );
}

export default LogsTable;
