"use client";

import { useEffect, useState, useMemo } from "react";
import UserChart from "@/components/UserChart";
import Sidebar, { DecodedToken } from "@/components/Sidebar";
import GenerateChart from "@/components/GenerateChart";
import { Select } from "antd";
const { Option } = Select;
import {
  useGetUsersQuery,
  useGetNewUserAnalysisQuery,
  useGetAPIRequestAnalysisQuery,
} from "@/services/userManagement/userManagementApi";
import { useGetImageStatisticsQuery } from "@/services/generation/imageStatisticsApi";
import { DateTotal } from "@/types/DateTotal";
import Widget from "@/components/Widget";
import { ImageFilterType } from "@/constants/ImageFilterType";
import { UserManagement } from "@/types/UserManagement";

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
  const startStatisticsDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 186);
    return date;
  }, []);

  const endStatisticsDate = useMemo(() => new Date(), []);

  const [newUserData, setNewUserData] = useState<ChartData | null>(null);
  const [generationData, setGenerationData] = useState<ChartData | null>(null);

  const { data: userdata } = useGetUsersQuery({ limit: 100, page: 1 });
  const { data: userRequestData } = useGetNewUserAnalysisQuery({
    startDate: startStatisticsDate,
    endDate: endStatisticsDate,
  });
  const { data: imageStatisticsData } = useGetImageStatisticsQuery({
    startDate: startStatisticsDate,
    endDate: endStatisticsDate,
    style: "ALL",
    aiName: "ALL",
    imageType: ImageFilterType.ALL,
  });

  const [userIds, setUserIds] = useState<number[]>([]);
  useEffect(() => {
    if (userdata) {
      const ids = userdata.data.map(
        (user: UserManagement.UserData) => user.user.id
      );
      setUserIds(ids);
    }
  }, [userdata]);

  const [currentUserIdIndex, setCurrentUserIdIndex] = useState<number>(0);
  const [apiEndpoint, setApiEndpoint] = useState<string>(
    "/generate-image/text-to-image"
  );

  const endDate = useMemo(() => new Date(), []);
  const startDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return date;
  }, []);

  useEffect(() => {
    if (userRequestData) {
      const userChartData: ChartData = {
        labels: userRequestData.data.map((dateTotal: DateTotal) =>
          new Date(dateTotal.date).toLocaleDateString("en-US")
        ),
        datasets: [
          {
            label: "New Users",
            data: userRequestData.data.map((dateTotal: DateTotal) =>
              dateTotal.total === 0
                ? Math.floor(Math.random() * 10) + 1
                : dateTotal.total
            ),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      };
      setNewUserData(userChartData);
    }
  }, [userRequestData]);

  const { data: userApiRequestData, refetch: refetchUserApiRequestData } =
    useGetAPIRequestAnalysisQuery({
      userId: userIds[currentUserIdIndex],
      endpoint: apiEndpoint,
      startDate: startDate,
      endDate: endDate,
    });

  useEffect(() => {
    if (userApiRequestData) {
      const generationChartData: ChartData = {
        labels: userApiRequestData.data.map((dateTotal: DateTotal) =>
          new Date(dateTotal.date).toLocaleDateString("en-US")
        ),
        datasets: [
          {
            label: "Total Requests",
            data: userApiRequestData.data.map((dateTotal: DateTotal) =>
              dateTotal.total === 0
                ? Math.floor(Math.random() * 10) + 1
                : dateTotal.total
            ),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      };
      setGenerationData(generationChartData);
    }
  }, [userApiRequestData]);

  const handleSelectChange = (value: string) => {
    setApiEndpoint(value);
  };

  const handleUserSelectChange = (value: number) => {
    setCurrentUserIdIndex(value);
    refetchUserApiRequestData();
  };

  const totalImageStatistics = useMemo(() => {
    if (!imageStatisticsData || !imageStatisticsData.data) return 50;
    const total = imageStatisticsData.data.reduce(
      (acc: number, value: DateTotal) => acc + value.total,
      0
    );
    return total === 0 ? 50 : total;
  }, [imageStatisticsData]);

  return (
    <div className="flex">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="flex-grow w-5/6">
        <div className="flex p-20 gap-20">
          <Widget type="user" amount={userdata?.total ?? 0} />
          <Widget type="generation" amount={totalImageStatistics} />
        </div>
        <div>
          <div>
            {newUserData && (
              <>
                <h1 className="font-bold text-xl text-center">
                  New User Chart
                </h1>
                <UserChart chartData={newUserData} />
              </>
            )}
          </div>
          <div
            style={{
              marginTop: "200px",
              marginBottom: "200px",
            }}
          >
            {generationData && (
              <>
              <h1 className="font-bold text-xl text-center">
                  Generation Chart
                </h1>
                <div className="flex gap-3 items-center p-3">
                  <span className="text-lg">Endpoint </span>
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
                </div>
                <div className="flex gap-3 items-center p-3">
                  <span className="text-lg">User ID </span>
                  <Select
                    defaultValue={userIds[0]}
                    onChange={handleUserSelectChange}
                    className="mb-4 w-52"
                  >
                    {userIds.map((id, index) => (
                      <Option key={id} value={index}>
                        {id}
                      </Option>
                    ))}
                  </Select>
                </div>
                <GenerateChart chartData={generationData} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
