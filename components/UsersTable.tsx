"use client";
import { Button, Table, Modal, Input, Select } from "antd";
import { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { ColumnType } from "antd/es/table";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  alias_name: string | null;
  role: string | null;
  status: string;
}

const apiData = {
  limit: 9007199254740991,
  page: 0,
  total: 2,
  data: [
    {
      user: {
        id: 5,
        first_name: "Hao",
        last_name: "Truong",
        phone: null,
        address: null,
        description: null,
        socials: null,
        alias_name: "Hao_Truong",
        role: "ADMIN",
        avatar: null,
        background: null,
        created_at: "2024-02-03T22:48:23.000Z",
        updated_at: "2024-05-18T03:35:34.000Z",
      },
      locked_information: null,
    },
    {
      user: {
        id: 6,
        first_name: "Thanh",
        last_name: "Le",
        phone: null,
        address: null,
        description: null,
        socials: null,
        alias_name: "Thanh_le",
        role: "USER",
        avatar: null,
        background: null,
        created_at: "2024-05-05T22:48:23.000Z",
        updated_at: "2024-05-05T22:48:23.000Z",
      },
      locked_information: null,
    },
  ],
};

function UsersTable() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dataSource, setDataSource] = useState<User[]>([]);

  useEffect(() => {
    const transformedData = apiData.data.map((item) => ({
      id: item.user.id,
      first_name: item.user.first_name,
      last_name: item.user.last_name,
      alias_name: item.user.alias_name,
      role: item.user.role,
      status: "active",
    }));
    setDataSource(transformedData);
  }, []);

  const columns: ColumnType<User>[] = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "first_name",
      title: "First Name",
      dataIndex: "first_name",
      sorter: (a: User, b: User) => a.first_name.localeCompare(b.first_name),
      sortDirections: ["descend", "ascend"],
    },
    {
      key: "last_name",
      title: "Last Name",
      dataIndex: "last_name",
      sorter: (a: User, b: User) => a.last_name.localeCompare(b.last_name),
      sortDirections: ["descend", "ascend"],
    },
    {
      key: "alias_name",
      title: "Alias Name",
      dataIndex: "alias_name",
    },
    {
      key: "role",
      title: "Role",
      dataIndex: "role",
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <span
          style={{
            background: text === "active" ? "green" : "red",
            padding: "3px 10px",
            borderRadius: 15,
            color: "white",
          }}
        >
          {text.toUpperCase()}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (record: User) => {
        return (
          <>
            <EditOutlined
              style={{ fontSize: 24 }}
              onClick={() => {
                onEditUser(record);
              }}
            />
            {record.status === "active" ? (
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
            <DeleteOutlined
              onClick={() => {
                onDeleteUser(record);
              }}
              style={{ color: "red", marginLeft: 12, fontSize: 24 }}
            />
          </>
        );
      },
    },
  ];

  const onToggleStatus = (record: User) => {
    if (record.status === "active") {
      Modal.confirm({
        title: "Select ban duration",
        content: (
          <Select
            defaultValue="1"
            style={{ width: 300 }}
            onChange={(value) => {
              banUser(record, value);
            }}
          >
            <Select.Option value="1">1 day</Select.Option>
            <Select.Option value="7">1 week</Select.Option>
            <Select.Option value="30">1 month</Select.Option>
            <Select.Option value="365">1 year</Select.Option>
            <Select.Option value="999">Permanent</Select.Option>
          </Select>
        ),
        okText: "Ban",
        okType: "danger",
        cancelText: "Cancel",
      });
    } else {
      Modal.confirm({
        title: "Are you sure you want to unban this user?",
        okText: "Yes",
        okType: "primary",
        cancelText: "No",
        onOk: () => {
          unbanUser(record);
        },
      });
    }
  };

  const banUser = (user: User, duration: string) => {
    const updatedDataSource = dataSource.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          status: "banned",
          banDuration: duration,
        };
      }
      return u;
    });
    setDataSource(updatedDataSource);
  };

  const unbanUser = (user: User) => {
    const updatedDataSource = dataSource.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          status: "active",
          banDuration: undefined,
        };
      }
      return u;
    });
    setDataSource(updatedDataSource);
  };

  const onDeleteUser = (record: User) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((prev) => prev.filter((user) => user.id !== record.id));
      },
    });
  };

  const onEditUser = (record: User) => {
    setIsEditing(true);
    setEditingUser({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingUser(null);
  };

  return (
    <div className="App p-12">
      <header className="App-header">
        <div className="mb-10 font-bold text-3xl">Total users</div>
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
        <Modal
          open={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          okButtonProps={{
            onClick: () => {
              Modal.confirm({
                title: "Are you sure you want to save changes?",
                okText: "Yes",
                okType: "primary",
                cancelText: "No",
                onOk: () => {
                  setDataSource((prev) =>
                    prev.map((user) => {
                      if (user.id === editingUser!.id) {
                        return editingUser!;
                      } else {
                        return user;
                      }
                    })
                  );
                  resetEditing();
                },
              });
            },
          }}
        >
          <div className="font-bold text-3xl text-center">Edit user</div>
          <div className="mb-4">
            <label className="block mb-2 font-bold">First Name:</label>
            <Input
              value={editingUser?.first_name}
              onChange={(e) => {
                setEditingUser((prev) => ({
                  ...prev!,
                  first_name: e.target.value,
                }));
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold">Last Name:</label>
            <Input
              value={editingUser?.last_name}
              onChange={(e) => {
                setEditingUser((prev) => ({
                  ...prev!,
                  last_name: e.target.value,
                }));
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold">Alias Name:</label>
            <Input
              value={editingUser?.alias_name ?? ""}
              onChange={(e) => {
                setEditingUser((prev) => ({
                  ...prev!,
                  alias_name: e.target.value,
                }));
              }}
            />
          </div>
        </Modal>
      </header>
    </div>
  );
}

export default UsersTable;
