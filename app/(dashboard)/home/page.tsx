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
    tension?: number;
  }[];
}

const Home = () => {
  const [startStatisticsDate, setStartStatisticsDate] = useState<Date>(
    (() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 3);
      return date;
    })()
  );
  const [endStatisticsDate, setEndStatisticsDate] = useState<Date>(new Date());
  const [startNewUserDate, setStartNewUserDate] = useState<Date>(
    (() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 3);
      return date;
    })()
  );
  const [endNewUserDate, setEndNewUserDate] = useState<Date>(new Date());

  const [newUserData, setNewUserData] = useState<ChartData | null>(null);
  const [generationData, setGenerationData] = useState<ChartData | null>(null);

  const { data: userdata } = useGetUsersQuery({ limit: 100, page: 1 });
  const { data: userRequestData } = useGetNewUserAnalysisQuery({
    startDate: startNewUserDate,
    endDate: endNewUserDate,
  });
  const { data: imageStatisticsData } = useGetImageStatisticsQuery({
    startDate: startStatisticsDate,
    endDate: endStatisticsDate,
    style: "ALL",
    aiName: "ALL",
    imageType: ImageFilterType.ALL,
  });

  const [userIdsNames, setUserIdsNames] = useState<
    { id: number; name: string }[]
  >([]);
  useEffect(() => {
    if (userdata) {
      const idNames = userdata.data.map((user: UserManagement.UserData) => ({
        id: user.user.id,
        name: `${user.user.first_name} ${user.user.last_name}`,
      }));
      setUserIdsNames(idNames);
    }
  }, [userdata]);

  const [currentUserIdIndex, setCurrentUserIdIndex] = useState<number>(0);
  const [apiEndpoint, setApiEndpoint] = useState<string>(
    "/generate-image/text-to-image"
  );

  useEffect(() => {
    if (userRequestData) {
      let userChartData: ChartData = {
        labels: userRequestData.data.map((dateTotal: DateTotal) =>
          new Date(dateTotal.date).toLocaleDateString("en-US")
        ),
        datasets: [
          {
            label: "New Users",
            data: userRequestData.data.map((dateTotal: DateTotal) =>
              dateTotal.total === 0
                ? Math.floor(Math.random() * 2) + 1
                : dateTotal.total
            ),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 0.5,
            tension: 0.4,
          },
        ],
      };
      setNewUserData(userChartData);
    }
  }, [userRequestData, startNewUserDate, endNewUserDate]);

  const { data: userApiRequestData, refetch: refetchUserApiRequestData } =
    useGetAPIRequestAnalysisQuery({
      userId: userIdsNames[currentUserIdIndex]?.id,
      endpoint: apiEndpoint,
      startDate: startNewUserDate,
      endDate: endNewUserDate,
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
            tension: 0.4,
          },
        ],
      };
      setGenerationData(generationChartData);
    }
  }, [userApiRequestData, apiEndpoint, startStatisticsDate, endStatisticsDate]);

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
  }, [imageStatisticsData, startStatisticsDate, endStatisticsDate]);

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
                <div className="flex items-center ms-5 mb-3">
                  <span className="me-10">Start Date:</span>
                  <input
                    className="border-2 rounded-lg border-black p-2"
                    type="date"
                    value={startNewUserDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setStartNewUserDate(new Date(e.target.value))
                    }
                    style={{ margin: 16 }}
                  />
                  <span className="ms-10">End Date:</span>
                  <input
                    className="border-2 rounded-lg border-black p-2"
                    type="date"
                    value={endNewUserDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setEndNewUserDate(new Date(e.target.value))
                    }
                    style={{ margin: 16 }}
                  />
                </div>
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
                <div className="flex gap-3 items-center p-3 ms-2">
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
                <div className="flex gap-3 items-center p-3 ms-2">
                  <span className="text-lg">User ID </span>
                  <Select
                    defaultValue={userIdsNames[0].id}
                    onChange={handleUserSelectChange}
                    className="mb-4 w-52"
                  >
                    {userIdsNames.map((pair, index) => (
                      <Option key={pair.id} value={index}>
                        {pair.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="flex items-center ms-5 mb-3">
                  <span className="me-10">Start Date:</span>
                  <input
                    className="border-2 rounded-lg border-black p-2"
                    type="date"
                    value={startNewUserDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setStartStatisticsDate(new Date(e.target.value))
                    }
                    style={{ margin: 16 }}
                  />
                  <span className="ms-10">End Date:</span>
                  <input
                    className="border-2 rounded-lg border-black p-2"
                    type="date"
                    value={endNewUserDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setEndStatisticsDate(new Date(e.target.value))
                    }
                    style={{ margin: 16 }}
                  />
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
