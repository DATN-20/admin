import Link from "next/link";

import {
  DashboardOutlined,
  UserOutlined,
  HighlightOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  return (
    <div className="sidebar flex flex-col border-r border-gray-300 min-h-screen bg-white w-full">
      <div className="top h-16 flex items-center justify-center">
        <Link href="/">
          <div className="logo text-lg font-bold text-purple-600">
            AI4Artist
          </div>
        </Link>
      </div>
      <hr className="border-t border-gray-300" />
      <div className="center px-4">
        <ul className="mt-4">
          <p className="title text-xs font-bold text-gray-600 uppercase">
            MAIN
          </p>
          <Link href="/home">
            <li className="flex items-center py-2 cursor-pointer hover:bg-gray-100">
              <DashboardOutlined
                className="icon text-purple-600"
                style={{ fontSize: "32px", marginRight: 10 }}
              />
              <span className="text-md font-semibold text-gray-800 ml-2">
                Dashboard
              </span>
            </li>
          </Link>

          <p className="title text-xs font-bold text-gray-600 uppercase mt-4">
            LISTS
          </p>
          <Link href="/users">
            <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100">
              <UserOutlined
                className="icon text-purple-600"
                style={{ fontSize: "32px", marginRight: 10 }}
              />
              <span className="text-md font-semibold text-gray-800 ml-2">
                Users
              </span>
            </div>
          </Link>
          <Link href="/generations">
            <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100">
              <HighlightOutlined
                className="icon text-purple-600"
                style={{ fontSize: "32px", marginRight: 10 }}
              />
              <span className="text-md font-semibold text-gray-800 ml-2">
                Generations
              </span>
            </div>
          </Link>
          <li className="flex items-center py-2 cursor-pointer hover:bg-gray-100">
            <LogoutOutlined
              className="icon text-purple-600"
              style={{ fontSize: "32px", marginRight: 10 }}
            />
            <span className="text-md font-semibold text-gray-800 ml-2">
              Logout
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
