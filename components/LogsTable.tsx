"use client";

import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { ColumnType } from "antd/es/table";

interface LogEntry {
  user_id: number;
  requested_at: string;
  endpoint: string;
  severity: string;
  message: string;
  file: string;
}

const dataFromApi = {
  total: 34,
  page: 1,
  limit: 6,
  data: [
    {
      user_id: 3,
      requested_at: "2024-05-07T15:39:04.815Z",
      endpoint: "/generate-image/text-to-image",
      severity: "info",
      message: "Text To Image",
      file: "logs-2024.05.07",
    },
    {
      user_id: 3,
      requested_at: "2024-05-07T15:39:06.822Z",
      endpoint: "/generate-image/text-to-image",
      severity: "info",
      message: "Text To Image",
      file: "logs-2024.05.07",
    },
    {
      user_id: 2,
      requested_at: "2024-05-07T15:00:54.423Z",
      endpoint: "/management/users",
      severity: "info",
      message: "access to api",
      file: "logs-2024.05.07",
    },
    {
      user_id: 2,
      requested_at: "2024-05-07T15:01:09.113Z",
      endpoint: "/management/users",
      severity: "info",
      message: "access to api",
      file: "logs-2024.05.07",
    },
    {
      user_id: 2,
      requested_at: "2024-05-07T15:01:20.093Z",
      endpoint: "/abc",
      severity: "info",
      message: "access to api",
      file: "logs-2024.05.07",
    },
    {
      user_id: 1,
      requested_at: "2024-05-07T14:31:05.211Z",
      endpoint: "/management/users",
      severity: "info",
      message: "access to api",
      file: "logs-2024.05.07",
    },
  ],
};

function LogsTable() {
  const [dataSource, setDataSource] = useState<LogEntry[]>([]);

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
