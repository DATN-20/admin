"use client";
import { Button, Table, Modal, Input, Select } from "antd";
import { useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { ColumnType } from "antd/es/table";

interface User {
  id: number;
  name: string;
  email: string;
  request: string;
  status: string;
}

function UsersTable() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dataSource, setDataSource] = useState<User[]>([
    {
      id: 1,
      name: "John",
      email: "john@gmail.com",
      request: "10",
      status: "active",
    },
    {
      id: 2,
      name: "David",
      email: "david@gmail.com",
      request: "10",
      status: "banned",
    },
    {
      id: 3,
      name: "James",
      email: "james@gmail.com",
      request: "10",
      status: "active",
    },
    {
      id: 4,
      name: "Sam",
      email: "sam@gmail.com",
      request: "10",
      status: "active",
    },
  ]);

  const columns: ColumnType<User>[] = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
    },

    {
      key: "2",
      title: "Name",
      dataIndex: "name",
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
      render: (text: string) => <a>{text}</a>,
    },
    {
      key: "3",
      title: "Email",
      dataIndex: "email",
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
      sortDirections: ["descend", "ascend"],
    },
    {
      key: "4",
      title: "Generation request",
      dataIndex: "request",
      sorter: (a: User, b: User) => parseInt(a.request) - parseInt(b.request),
      sortDirections: ["descend", "ascend"],
    },
    {
      key: "5", // Key mới
      title: "Status", // Tiêu đề cột
      dataIndex: "status", // Trường dữ liệu
      render: (text: string) => {
        return (
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
        );
      },
    },
    {
      key: "6",
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

  const onAddUser = () => {
    // const randomNumber = Math.random() * 1000;
    // const newUser: User = {
    //   id: randomNumber,
    //   name: "Name " + randomNumber,
    //   email: randomNumber + "@gmail.com",
    //   address: "Address " + randomNumber,
    // };
    // setDataSource((prev) => [...prev, newUser]);
  };
  const onToggleStatus = (record: User) => {
    if (record.status === "active") {
      // Nếu là active thì hiện modal chọn thời gian ban
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

            {/* Thêm các option khác nếu cần */}
          </Select>
        ),
        okText: "Ban",
        okType: "danger",
        cancelText: "Cancel",
      });
    } else {
      // Nếu là banned thì chỉ cần unban mà không cần chọn thời gian
      Modal.confirm({
        title: "Are you sure you want to unban this User?",
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
    // Cập nhật thông tin người dùng và thời gian ban
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
    // Chỉ cần cập nhật trạng thái của người dùng là active
    const updatedDataSource = dataSource.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          status: "active",
          banDuration: undefined, // Xóa thông tin thời gian ban khi unban
        };
      }
      return u;
    });
    setDataSource(updatedDataSource);
  };

  const onDeleteUser = (record: User) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this User record?",
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
        <Table columns={columns} dataSource={dataSource}></Table>
        <Modal
          open={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          // Thêm prop okButtonProps để tùy chỉnh nút OK
          okButtonProps={{
            // Sử dụng Modal.confirm của Ant Design khi nút OK được bấm
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
            <label className="block mb-2 font-bold">Name:</label>
            <Input
              value={editingUser?.name}
              onChange={(e) => {
                setEditingUser((prev) => ({ ...prev!, name: e.target.value }));
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold">Email:</label>
            <Input
              value={editingUser?.email}
              onChange={(e) => {
                setEditingUser((prev) => ({
                  ...prev!,
                  email: e.target.value,
                }));
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold">Generation request:</label>
            <Input
              value={editingUser?.request}
              onChange={(e) => {
                setEditingUser((prev) => ({
                  ...prev!,
                  times: e.target.value,
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
