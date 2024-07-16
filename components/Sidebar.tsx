"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import jwt from "jsonwebtoken";
import {
  DashboardOutlined,
  UserOutlined,
  HighlightOutlined,
  LogoutOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { useLogoutUserMutation } from "../services/auth/authApi";
import { toast } from "react-toastify";
import NextImage from "next/image";

export interface DecodedToken {
  id: number;
  role: string | null;
}

interface MenuItemProps {
  icon: React.ElementType;
  text: string;
  href: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, text, href }) => (
  <Link href={href}>
    <li className="flex items-center p-2 my-2 cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-purple-400 hover:via-indigo-500 hover:to-blue-400 hover:text-white">
      {Icon && (
        <Icon
          className="icon text-purple-600"
          style={{ fontSize: "32px", marginRight: 10 }}
        />
      )}
      <span className="text-md font-semibold ml-2">{text}</span>
    </li>
  </Link>
);

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: DecodedToken = jwt.decode(token) as DecodedToken;
      logoutUser({ id: decoded.id });
    }
    localStorage.removeItem("token");
    setTimeout(() => {
      toast.success("Logout successfully");
    }, 500);
    router.push("/");
  };

  return (
    <div className="sidebar flex flex-col border-r border-gray-300 min-h-screen bg-white w-full">
      <div className="top h-16 flex items-center justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-700 via-red-300 to-indigo-400 text-transparent bg-clip-text"
        >
          <NextImage alt="logo" width={80} height={80} src="/logo-black.png" />
          <span className="select-none bg-clip-text text-3xl font-mono">
            AI4Artist
          </span>
        </Link>
      </div>
      <hr className="border-t border-gray-300" />
      <div className="center px-4">
        <ul className="mt-4">
          <p className="title text-xs font-bold text-gray-600 uppercase">
            MAIN
          </p>
          <MenuItem href="/home" icon={DashboardOutlined} text="Dashboard" />
          <p className="title text-xs font-bold text-gray-600 uppercase mt-4">
            LISTS
          </p>
          <MenuItem href="/users" icon={UserOutlined} text="Users" />
          <MenuItem
            href="/generations"
            icon={HighlightOutlined}
            text="Generations"
          />
          <MenuItem
            href="/logs"
            icon={SolutionOutlined}
            text="Logs Monitoring"
          />
          <li
            className="flex items-center p-2 my-2 cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-purple-400 hover:via-indigo-500 hover:to-blue-400 hover:text-white"
            onClick={handleLogout}
          >
            <LogoutOutlined
              className="icon text-purple-600"
              style={{ fontSize: "32px", marginRight: 10 }}
            />
            <span className="text-md font-semibold ml-2">Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
