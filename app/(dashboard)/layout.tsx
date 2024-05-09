//make a layout nextjs
import { Layout } from "antd";
// make the sidebar for all page here
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
