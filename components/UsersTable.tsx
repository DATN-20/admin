"use client";
import { Button, Table, Modal, Input } from "antd";
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
  times: string;
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
      times: "10",
      status: "active",
    },
    {
      id: 2,
      name: "David",
      email: "david@gmail.com",
      times: "10",
      status: "banned",
    },
    {
      id: 3,
      name: "James",
      email: "james@gmail.com",
      times: "10",
      status: "active",
    },
    {
      id: 4,
      name: "Sam",
      email: "sam@gmail.com",
      times: "10",
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
      title: "Generation times",
      dataIndex: "times",
      sorter: (a: User, b: User) => parseInt(a.times) - parseInt(b.times),
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
    const updatedDataSource = dataSource.map((user) => {
      if (user.id === record.id) {
        return {
          ...user,
          status: user.status === "active" ? "banned" : "active",
        };
      }
      return user;
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
            <label className="block mb-2 font-bold">Generation times:</label>
            <Input
              value={editingUser?.times}
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
