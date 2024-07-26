"use client";

import React, { useEffect, useState } from "react";
import { Select, Table } from "antd";
import { ColumnType } from "antd/es/table";
import { LogMonitoring } from "@/types/LogMonitoring";
import axios from "axios";

function LogsTable() {
  const [dataSource, setDataSource] = useState<LogMonitoring.ApiLogJson[]>([]);
  
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [startDate, setStartDate] = useState<Date>((() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date;
  })());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [endpointIndex, setEndpointIndex] = useState<number>(0);
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
  
  const fetchDataWithAxios = async () => {
    try {
      const baseQuery = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(baseQuery + 'api/v1/admin/management/logging/api', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          endpoint: endpoints[endpointIndex].endpoint,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          limit: pagination.pageSize,
          page: pagination.current
        }
      }) as LogMonitoring.GetApiLoggingResponse;
      if (Array.isArray(response.data)) {
        setDataSource(response.data);
      
      setPagination({
        ...pagination,
        current: 1
      });
    }
        
    } catch (err) {
      console.error(err);
    } finally {
      
    }
  };

  useEffect(() => {
    fetchDataWithAxios();
  }, [endpointIndex, startDate, endDate]);

  const columns: ColumnType<LogMonitoring.ApiLogJson>[] = [
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
        <div className="flex items-center ms-5 mb-3">
        <span>Select Endpoint:</span>
        <Select
        className="border-2 rounded-lg border-black p-2 focus:border-black"
          value={endpoints[endpointIndex].endpoint}
          onChange={(value) => {
            setEndpointIndex(
              endpoints.findIndex((ep) => ep.endpoint === value)
            );
          }}
          style={{ margin: 16, width: 200 }}
        >
          {endpoints.map((ep) => (
            <Select.Option key={ep.endpoint} value={ep.endpoint}>
              {ep.displayText}
            </Select.Option>
          ))}
        </Select>
        <div className="flex items-center ms-5 mb-3">
        <span className="me-10">Start Date:</span>
        <input
        className="border-2 rounded-lg border-black p-2"
          type="date"
          value={startDate.toISOString().split("T")[0]}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          style={{ margin: 16 }}
        />
        <span className="ms-10">End Date:</span>
        <input
        className="border-2 rounded-lg border-black p-2"
          type="date"
          value={endDate.toISOString().split("T")[0]}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          style={{ margin: 16 }}
        />
      </div>
      </div>
        <Table columns={columns} dataSource={dataSource} rowKey="user_id"
        pagination={{
          ...pagination,
          total: dataSource.length || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) =>
            setPagination({ current: page, pageSize }),
          onShowSizeChange: (current, size) =>
            setPagination({ current, pageSize: size }),
        }} />
      </header>
    </div>
  );
}

export default LogsTable;
