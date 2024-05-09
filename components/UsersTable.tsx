"use client";
import { Button, Table, Modal, Input } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ColumnType } from "antd/es/table";

interface User {
  id: number;
  name: string;
  email: string;
  times: string;
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
    },
    {
      id: 2,
      name: "David",
      email: "david@gmail.com",
      times: "10",
    },
    {
      id: 3,
      name: "James",
      email: "james@gmail.com",
      times: "10",
    },
    {
      id: 4,
      name: "Sam",
      email: "sam@gmail.com",
      times: "10",
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
      key: "5",
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
          title="Edit User"
          open={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            setDataSource((prev) =>
              prev.map((User) => {
                if (User.id === editingUser!.id) {
                  return editingUser!;
                } else {
                  return User;
                }
              })
            );
            resetEditing();
          }}
        >
          <Input
            value={editingUser?.name}
            onChange={(e) => {
              setEditingUser((prev) => ({ ...prev!, name: e.target.value }));
            }}
          />
          <Input
            value={editingUser?.email}
            onChange={(e) => {
              setEditingUser((prev) => ({
                ...prev!,
                email: e.target.value,
              }));
            }}
          />
          <Input
            value={editingUser?.times}
            onChange={(e) => {
              setEditingUser((prev) => ({
                ...prev!,
                address: e.target.value,
              }));
            }}
          />
        </Modal>
      </header>
    </div>
  );
}

export default UsersTable;
