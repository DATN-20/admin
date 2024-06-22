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
import axiosInstance from "@/axiosInstance"; // Ensure this is correctly set up to handle your API requests
import axios from "axios";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  alias_name: string | null;
  role: string | null;
  status: string;
}

function UsersTable() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axiosInstance
      .get("/api/v1/admin/management/users", {
        params: {
          limit: 1000,
          page: 1,
        },
      })
      .then((response) => {
        const apiData = response.data;
        const transformedData = apiData.data.map((item: any) => ({
          id: item.user.id,
          first_name: item.user.first_name,
          last_name: item.user.last_name,
          alias_name: item.user.alias_name,
          role: item.user.role,
          status: item.locked_information ? "banned" : "active",
        }));
        setDataSource(transformedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
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
            {/* <DeleteOutlined
              onClick={() => {
                onDeleteUser(record);
              }}
              style={{ color: "red", marginLeft: 12, fontSize: 24 }}
            /> */}
          </>
        );
      },
    },
  ];

  const onToggleStatus = (record: User) => {
    if (record.status === "active") {
      let selectedValue = "1";
      Modal.confirm({
        title: "Select ban duration",
        content: (
          <Select
            defaultValue="1"
            style={{ width: 300 }}
            onChange={(value) => (selectedValue = value)}
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
        onOk: (value) => {
          banUser(record, selectedValue);
          Modal.destroyAll();
        },
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
    const type = duration === "999" ? "permanent" : "temparory";
    axiosInstance
      .post("/api/v1/admin/management/users/lock", {
        lockedUserId: user.id,
        type: type,
        period: duration,
        unit: "days",
      })
      .then((response) => {
        // Handle success
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
      })
      .catch((error) => {
        // Handle error
        console.error("There was an error banning the user!", error);
      });
  };

  const unbanUser = (user: User) => {
    axiosInstance
      .patch("/api/v1/admin/management/users/unlock", {
        lockedUserId: user.id,
      })
      .then((response) => {
        // Handle success
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
      })
      .catch((error) => {
        // Handle error
        console.error("There was an error banning the user!", error);
      });
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
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
        />
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
