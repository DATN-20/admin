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

interface Generation {
  id: number;
  prompt: string;
  username: string;
  type: string;
}

function GenerationsTable() {
  return (
    <div>Doing</div>
  );
}

export default GenerationsTable;
