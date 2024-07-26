import { useGetAPIRequestAnalysisQuery } from "@/services/userManagement/userManagementApi";
import { DateTotal } from "@/types/DateTotal";
import { UserManagement } from "@/types/UserManagement";
import { Alert, Select, Spin, Table } from "antd";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserRequestTable = ({ userId }: { userId: string }) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);
  const endDate = new Date();
  const id = parseInt(userId);
  const endpoints = [
    {
      endpoint: "/generate-image/image-to-image",
      displayText: "Image to Image",
    },
    {
      endpoint: "/generate-image/text-to-image",
      displayText: "Text to Image",
    },
    {
      endpoint: "/generate-image/image-by-images-style",
      displayText: "Generate with Style",
    },
    {
      endpoint: "/images/interact",
      displayText: "Interact image",
    },
    {
      endpoint: "generate-tag",
      displayText: "Generate Tag",
    },
  ];
  const [endpointIndex, setEndpointIndex] = useState<number>(0);
  const [dataSource, setDataSource] = useState<DateTotal[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const {
    data: userRequestData,
    isLoading,
    error,
    refetch,
    isFetching
  } = useGetAPIRequestAnalysisQuery({
    userId: id,
    endpoint: endpoints[endpointIndex].endpoint,
    startDate: startDate,
    endDate: endDate,
  });

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Request Count",
      dataIndex: "total",
      key: "total",
    },
  ];

  useEffect(() => {
    console.log('userRequestData:', userRequestData, isLoading);
    if (typeof userRequestData === "undefined") return;

    setDataSource(userRequestData.data);
  }, [userRequestData, pagination, isLoading]);

  return (
    <div>
      <h1 className="p-5 text-xl font-bold">
        User Requests for the Last 3 Months
      </h1>
      <div className="flex items-center ms-5 mb-3">
        <span>Select Endpoint:</span>
        <Select
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
      </div>
      <Table
        dataSource={userRequestData?.data}
        columns={columns}
        rowKey="date"
        loading={isLoading}
        pagination={{
          ...pagination,
          total: userRequestData?.data.length || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) =>
            setPagination({ current: page, pageSize }),
          onShowSizeChange: (current, size) =>
            setPagination({ current, pageSize: size }),
        }}
      />
    </div>
  );
};

export default UserRequestTable;
