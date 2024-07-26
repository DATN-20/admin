import { useGetAPIRequestAnalysisQuery } from "@/services/userManagement/userManagementApi";
import { DateTotal } from "@/types/DateTotal";
import { UserManagement } from "@/types/UserManagement";
import { Alert, Select, Spin, Table } from "antd";
import axios from "axios";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserRequestTable = ({ userId }: { userId: string}) => {
  const [startDate, setStartDate] = useState<Date>((() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date;
  })());
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const [endDate, setEndDate] = useState<Date>(new Date());
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

  const fetchDataWithAxios = async () => {
    try {
      const baseQuery = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(baseQuery + 'api/v1/admin/management/users/api-request-times', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          userId: id,
          endpoint: endpoints[endpointIndex].endpoint,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }
      });
      setDataSource(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      
    }
  };

  useEffect(() => {
    fetchDataWithAxios();
  }, [endpointIndex, startDate, endDate]);

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

  return (
    <div>
      <h1 className="p-5 text-xl font-bold">
        User Requests for the Last 3 Months
      </h1>
      {firstName && (<span className="p-5"><span className="font-bold">First Name:</span> {firstName}</span>)}
      {lastName && (<span className="p-5"><span className="font-bold">Last Name: </span>{lastName}</span>)}
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
      </div>
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
      <div className="flex justify-center">
        <Table
        className="w-2/3"
          dataSource={dataSource}
          columns={columns}
          rowKey="date"
          pagination={{
            ...pagination,
            total: dataSource.length || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, pageSize) =>
              setPagination({ current: page, pageSize }),
            onShowSizeChange: (current, size) =>
              setPagination({ current, pageSize: size }),
          }}
        />
      </div>
    </div>
  );
};

export default UserRequestTable;
