import { UserOutlined, HighlightOutlined, UpOutlined } from "@ant-design/icons";
import Link from "next/link";
interface WidgetProps {
  type: "user" | "generation";
  amount: number;
}

interface WidgetData {
  color: string;
  title: string;
  isMoney: boolean;
  link: JSX.Element;
  icon: JSX.Element;
}

const Widget: React.FC<WidgetProps> = ({ type, amount }) => {
  let data = {} as WidgetData;

  switch (type) {
    case "user":
      data = {
        color: "#F883B7",
        title: "TOTAL USERS",
        isMoney: false,
        link: (
          <Link href="/users" className="no-underline">
            See all users
          </Link>
        ),
        icon: (
          <UserOutlined
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
              border: "1px solid crimson",
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
        color: "goldenrod",
        title: "TOTAL GENERATIONS",
        isMoney: false,
        link: <Link href="/generations">View all generations</Link>,
        icon: (
          <HighlightOutlined
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
              border: "1px solid goldenrod",
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
    <div
      className="widget flex justify-between flex-1 p-4 shadow-md rounded-lg h-32"
      style={{
        border: `3px solid ${data?.color}`,
      }}
    >
      <div className="left flex flex-col justify-between">
        <span className="title font-bold text-gray-600 text-xl">{data?.title}</span>
        <span className="counter text-2xl font-bold">
          {data?.isMoney && "$"} {amount}
        </span>
        <span
          className="text-sm font-bold"
          style={{
            color: data?.color,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "black";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = data?.color;
          }}
        >
          {data?.link}
        </span>
      </div>
      <div className="right flex flex-col justify-center items-center">
        {data?.icon}
      </div>
    </div>
  );
};

export default Widget;
