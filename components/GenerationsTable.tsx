"use client";
import { Button, Table, Modal, Input, Select } from "antd";
import { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { ColumnType } from "antd/es/table";
import { DateTotal } from "@/types/DateTotal";
import axios from "axios";
import { ImageFilterType } from "@/constants/ImageFilterType";
import { ImageStatistics } from "@/types/ImageStatistics";

interface Generation {
  id: number;
  prompt: string;
  username: string;
  type: string;
}

function GenerationsTable() {
  const [dataSource, setDataSource] = useState<DateTotal[]>([]);

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [startDate, setStartDate] = useState<Date>(
    (() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 3);
      return date;
    })()
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [styleIndex, setStyleIndex] = useState<number>(0);
  const [aiIndex, setAiIndex] = useState<number>(0);
  const [imageFilterIndex, setImageFilterIndex] = useState<number>(0);
  const [endpoint, setEndpoint] = useState<string | undefined>("");
  const styles = [
    {
      modelName: "ALL",
      displayText: "All",
    },
    {
      modelName: "v1-5-pruned-emaonly.ckpt",
      displayText: "Base",
    },
    {
      modelName: "counterfeitV30_v30.safetensors",
      displayText: "Anime",
    },
    {
      modelName: "toonyou_beta6.safetensors",
      displayText: "Cartoon",
    },
    {
      modelName: "majicmixRealistic_v7.safetensors",
      displayText: "Realistic",
    },
  ];

  const aiNames = [
    {
      name: "ALL",
      displayText: "All",
    },
    {
      name: "comfyUI",
      displayText: "ComfyUI",
    },
  ];

  const imageFilterTypes = [
    {
      type: ImageFilterType.UPLOADED,
      displayText: "Uploaded",
    },
    {
      type: ImageFilterType.IMG_TO_IMG,
      displayText: "Image To Image",
    },
    {
      type: ImageFilterType.TEXT_TO_IMG,
      displayText: "Text To Image",
    },
    {
      type: ImageFilterType.IMG_BY_IMAGES_STYLE,
      displayText: "Image By Other Images Style",
    },
    {
      type: ImageFilterType.ALL,
      displayText: "All",
    },
  ];

  const fetchDataWithAxios = async () => {
    try {
      const baseQuery = process.env.NEXT_PUBLIC_API_URL;
      const response = (await axios.get(
        baseQuery + "api/v1/admin/statistic/images/generated",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            style: styles[styleIndex].modelName,
            aiName: aiNames[aiIndex].name,
            imageType: imageFilterTypes[imageFilterIndex].type,
          },
        }
      ));
        setEndpoint(response?.data.endpoint);
        setDataSource(response.data.data);
        setPagination({
          ...pagination,
          current: 1,
        });
      
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  useEffect(() => {
    fetchDataWithAxios();
  }, [startDate, endDate, styleIndex, aiIndex, imageFilterIndex]);

  const columns: ColumnType<DateTotal>[] = [
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
    <div className="App p-12">
      <header className="App-header">
        <div className="mb-10 font-bold text-3xl">Logs Monitoring</div>
        <div>
          <span>Select style:</span>
          <Select
            className="border-2 rounded-lg border-black p-2 focus:border-black"
            value={styles[styleIndex].modelName}
            onChange={(value) => {
              setStyleIndex(styles.findIndex((ep) => ep.modelName === value));
            }}
            style={{ margin: 16, width: 200 }}
          >
            {styles.map((ep) => (
              <Select.Option key={ep.modelName} value={ep.modelName}>
                {ep.displayText}
              </Select.Option>
            ))}
          </Select>
          <div className="flex items-center mb-3">
            <span>Select AI:</span>
            <Select
              className="border-2 rounded-lg border-black p-2 focus:border-black"
              value={aiNames[aiIndex].name}
              onChange={(value) => {
                setStyleIndex(aiNames.findIndex((ep) => ep.name === value));
              }}
              style={{ margin: 16, width: 200 }}
            >
              {aiNames.map((ep) => (
                <Select.Option key={ep.name} value={ep.name}>
                  {ep.displayText}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="flex items-center mb-3">
            <span>Select type of image:</span>
            <Select
              className="border-2 rounded-lg border-black p-2 focus:border-black"
              value={imageFilterTypes[imageFilterIndex].type}
              onChange={(value) => {
                setStyleIndex(
                  imageFilterTypes.findIndex((ep) => ep.type === value)
                );
              }}
              style={{ margin: 16, width: 200 }}
            >
              {imageFilterTypes.map((ep) => (
                <Select.Option key={ep.type} value={ep.type}>
                  {ep.displayText}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className="flex items-center mb-3">
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
          <div>Endpoint: {endpoint}</div>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="user_id"
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
      </header>
    </div>
  );
}

export default GenerationsTable;
