"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import UserChart from "@/components/UserChart"; // Ensure you are importing the correct component
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Widget from "@/components/Widget";
import GenerateChart from "@/components/GenerateChart";
import { Select } from "antd"; // Import Select from antd
const { Option } = Select;

interface ApiDataEntry {
  date: string;
  total: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const Home = () => {
  const [userData, setUserData] = useState<ChartData | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    // Fetch the data from the API
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);

    // Format dates to ISO string
    const formattedEndDate = endDate.toISOString();
    const formattedStartDate = startDate.toISOString();

    axiosInstance
      .get("/api/v1/admin/management/users/analysis/new-user", {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      })
      .then((response) => {
        console.log(response);
        const apiData = response.data;

        const labels = apiData.data.map((entry: ApiDataEntry) =>
          new Date(entry.date).toLocaleDateString("en-US")
        );
        const data = apiData.data.map((entry: ApiDataEntry) => entry.total);

        const chartData: ChartData = {
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
        const total = data.reduce(
          (acc: number, value: number) => acc + value,
          0
        );

        setUserData(chartData);
        setTotalUsers(total);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const [chartData, setChartData] = useState<any>(null);
  const [apiEndpoint, setApiEndpoint] = useState<string>(
    "/generate-image/text-to-image"
  );

  useEffect(() => {
    // Fetch the data from the API
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);

    // Format dates to ISO string
    const formattedEndDate = endDate.toISOString();
    const formattedStartDate = startDate.toISOString();

    axiosInstance
      .get("/api/v1/admin/management/users/api-request-times", {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          endpoint: apiEndpoint,
          userId: localStorage.getItem("userID"),
          // Pass the selected API endpoint
        },
      })
      .then((response) => {
        console.log(response);
        const apiData = response.data;

        const labels = apiData.data.map((entry: any) =>
          new Date(entry.date).toLocaleDateString("en-US")
        );
        const data = apiData.data.map((entry: any) => entry.total);

        const chartData = {
          labels: labels,
          datasets: [
            {
              label: "Total API Requests",
              data: data,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        };

        setChartData(chartData);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [apiEndpoint]); // Re-fetch data when apiEndpoint changes

  const handleSelectChange = (value: string) => {
    setApiEndpoint(value);
  };
  return (
    <div className="flex">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="flex-grow w-5/6">
        <Navbar />
        <div className="flex p-20 gap-20">
          <Widget type="user" amount={totalUsers} />
          <Widget type="generation" amount={50} />
        </div>
        <div className="flex">
          {userData && <UserChart chartData={userData} />}
          <div>
            <Select
              defaultValue="/generate-image/text-to-image"
              onChange={handleSelectChange}
              className="mb-4 w-52"
            >
              <Option value="/generate-image/text-to-image">
                Text to image
              </Option>
              <Option value="/generate-image/image-to-image">
                Image to image
              </Option>
              <Option value="/generate-image/image-by-images-style">
                Image by images style
              </Option>
            </Select>
            {chartData && <GenerateChart chartData={chartData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
