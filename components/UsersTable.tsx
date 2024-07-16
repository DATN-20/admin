"use client";

import { useRouter } from "next/navigation";
import { Button, Table, Modal, Select } from "antd";
import { useState, useEffect } from "react";
import {
  StopOutlined,
  UnlockOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ColumnType } from "antd/es/table";
import {
  useGetUsersQuery,
  useLockUserMutation,
  useUnlockUserMutation,
} from "@/services/userManagement/userManagementApi";
import { UserManagement } from "@/types/UserManagement";
import { LockUserType } from "@/constants/LockUserType";
import { DateUnit } from "@/constants/DateUnit";

function UsersTable() {
  const [dataSource, setDataSource] = useState<UserManagement.UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const router = useRouter();

  const { data: userdata } = useGetUsersQuery({
    limit: pagination.pageSize,
    page: pagination.current,
  });

  const [lockUser] = useLockUserMutation();
  const [unlockUser] = useUnlockUserMutation();

  const lockDurationOptions = [
    { value: "1", label: "1 day" },
    { value: "7", label: "1 week" },
    { value: "30", label: "1 month" },
    { value: "365", label: "1 year" },
    { value: "999", label: "Permanent" },
  ];

  useEffect(() => {
    if (typeof userdata === "undefined") return;
    setDataSource(userdata.data);
    setTotalUsers(userdata.total);
    setLoading(false);
  }, [userdata, pagination]);

  const columns: ColumnType<UserManagement.UserData>[] = [
    {
      key: "id",
      title: "ID",
      dataIndex: ["user", "id"],
    },
    {
      key: "first_name",
      title: "First Name",
      dataIndex: ["user", "first_name"],
      sorter: (a: UserManagement.UserData, b: UserManagement.UserData) =>
        a.user.first_name.localeCompare(b.user.first_name),
      sortDirections: ["descend", "ascend"],
    },
    {
      key: "last_name",
      title: "Last Name",
      dataIndex: ["user", "last_name"],
      sorter: (a: UserManagement.UserData, b: UserManagement.UserData) =>
        a.user.last_name.localeCompare(b.user.last_name),
      sortDirections: ["descend", "ascend"],
    },
    {
      key: "alias_name",
      title: "Alias Name",
      dataIndex: ["user", "alias_name"],
    },
    {
      key: "role",
      title: "Role",
      dataIndex: ["user", "role"],
    },
    {
      key: "locked_information",
      title: "Status",
      dataIndex: "locked_information",
      render: (locked_information: UserManagement.LockedInformation | null) => (
        <span
          style={{
            background: !locked_information ? "green" : "red",
            padding: "3px 10px",
            borderRadius: 15,
            color: "white",
          }}
        >
          {locked_information ? "Banned" : "Active"}
        </span>
      ),
    },
    {
      key: "ban_duration",
      title: "Ban Duration",
      render: (record: UserManagement.UserData) => {
        if (!record.locked_information) return "";
        if (record.locked_information.type === LockUserType.PERMANENT) {
          return "Permanent";
        }
        var startBan = new Date(
          record.locked_information.locked_at
        ).toLocaleDateString();
        var endBan = new Date(
          record.locked_information.expired_at
        ).toLocaleDateString();
        return startBan + " - " + endBan;
      },
    },
    {
      key: "actions",
      title: "Actions",
      render: (record: UserManagement.UserData) => {
        return (
          <div className="flex items-center">
            <InfoCircleOutlined
              style={{ fontSize: 24 }}
              className="hover:text-blue-500 cursor-pointer"
              onClick={() => {
                router.push(`/users/${record.user.id}`);
              }}
            />
            {!record.locked_information ? (
              <StopOutlined
                onClick={() => {
                  onToggleStatus(record);
                }}
                style={{ color: "red", marginLeft: 12, fontSize: 24 }}
                rotate={90}
              />
            ) : (
              <UnlockOutlined
                onClick={() => {
                  onToggleStatus(record);
                }}
                style={{ color: "green", marginLeft: 12, fontSize: 24 }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const onToggleStatus = (record: UserManagement.UserData) => {
    if (!record.locked_information) {
      let selectedValue = "1";
      Modal.confirm({
        title: "Select lock duration",
        content: (
          <Select
            defaultValue="1"
            style={{ width: 300 }}
            onChange={(value) => (selectedValue = value)}
          >
            {lockDurationOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        ),
        okText: "Lock",
        okType: "danger",
        cancelText: "Cancel",
        onOk: () => {
          banUser(record, selectedValue);
          Modal.destroyAll();
        },
      });
    } else {
      Modal.confirm({
        title: "Are you sure you want to unlock this user?",
        okText: "Yes",
        okType: "primary",
        cancelText: "No",
        onOk: () => {
          unbanUser(record);
        },
      });
    }
  };

  const banUser = (user: UserManagement.UserData, duration: string) => {
    const type =
      duration === "999" ? LockUserType.PERMANENT : LockUserType.TEMPARORY;
    lockUser({
      lockedUserId: user.user.id,
      type: type,
      period: parseInt(duration),
      unit: DateUnit.DAYS,
    }).unwrap();

    const updatedDataSource = dataSource.map((u) => {
      if (u.user.id === user.user.id) {
        const updatedUser = {
          ...u,
          locked_information: {
            user_id: user.user.id,
            type: type,
            locked_at: new Date(),
            expired_at: new Date(
              new Date().setDate(new Date().getDate() + parseInt(duration))
            ),
          },
        };
        return updatedUser;
      }
      return u;
    });
    setDataSource(updatedDataSource);
  };

  const unbanUser = (user: UserManagement.UserData) => {
    unlockUser({ lockedUserId: user.user.id });
    const updatedDataSource = dataSource.map((u) => {
      if (u.user.id === user.user.id) {
        const updatedUser = {
          ...u,
          locked_information: null,
        };
        return updatedUser;
      }
      return u;
    });
    setDataSource(updatedDataSource);
  };

  return (
    <div className="App p-12">
      <header className="App-header">
        <div className="mb-10 font-bold text-3xl">
          Total users: {totalUsers}
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            total: totalUsers,
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

export default UsersTable;
