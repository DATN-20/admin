import { UserOutlined, HighlightOutlined, UpOutlined } from "@ant-design/icons";
import Link from "next/link";
interface WidgetProps {
  type: "user" | "generation";
  amount: number;
}
const Widget: React.FC<WidgetProps> = ({ type, amount }) => {
  let data;

  //temporary

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: <Link href="/users">See all users</Link>,
        icon: (
          <UserOutlined
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
              fontSize: 28,
              borderRadius: 10,
              padding: 5,
            }}
          />
        ),
      };
      break;
    case "generation":
      data = {
        title: "GENERATIONS",
        isMoney: false,
        link: <Link href="/generations">View all generations</Link>,
        icon: (
          <HighlightOutlined
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
              fontSize: 28,
              borderRadius: 10,
              padding: 5,
            }}
          />
        ),
      };
      break;

    default:
      break;
  }

  return (
    <div className="widget flex justify-between flex-1 p-4 shadow-md rounded-lg h-32">
      <div className="left flex flex-col justify-between">
        <span className="title font-bold text-gray-600">{data?.title}</span>
        <span className="counter text-2xl font-light">
          {data?.isMoney && "$"} {amount}
        </span>
        <span className="link text-sm border-b border-gray-400">
          {data?.link}
        </span>
      </div>
      <div className="right flex flex-col justify-between items-end">
        {data?.icon}
      </div>
    </div>
  );
};

export default Widget;
