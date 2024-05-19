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

interface Generation {
  id: number;
  prompt: string;
  username: string;
  type: string;
}

function GenerationsTable() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingGeneration, setEditingGeneration] = useState<Generation | null>(
    null
  );
  const [dataSource, setDataSource] = useState<Generation[]>([
    {
      id: 1,
      prompt: "Prompt 1",
      username: "John",
      type: "Image to image",
    },
    {
      id: 2,
      prompt: "Prompt 2",
      username: "David",
      type: "Text to image",
    },
    {
      id: 3,
      prompt: "Prompt 3",
      username: "James",
      type: "By style",
    },
    {
      id: 4,
      prompt: "Prompt 4",
      username: "Sam",
      type: "Text to image",
    },
  ]);

  const columns: ColumnType<Generation>[] = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "2",
      title: "Prompt",
      dataIndex: "prompt",
      sorter: (a: Generation, b: Generation) =>
        a.prompt.localeCompare(b.prompt),
      sortDirections: ["descend", "ascend"],
      render: (text: string) => <a>{text}</a>,
    },
    {
      key: "3",
      title: "Username",
      dataIndex: "username",
      sorter: (a: Generation, b: Generation) =>
        a.username.localeCompare(b.username),
      sortDirections: ["descend", "ascend"],
    },
    {
      key: "4",
      title: "Type",
      dataIndex: "type",
    },
    {
      key: "5",
      title: "Actions",
      render: (record: Generation) => {
        return (
          <>
            <EditOutlined
              style={{ fontSize: 24 }}
              onClick={() => {
                onEditGeneration(record);
              }}
            />

            <DeleteOutlined
              onClick={() => {
                onDeleteGeneration(record);
              }}
              style={{ color: "red", marginLeft: 12, fontSize: 24 }}
            />
          </>
        );
      },
    },
  ];

  const onAddGeneration = () => {
    // Logic to add a new generation
  };

  const onDeleteGeneration = (record: Generation) => {
    Modal.confirm({
      title: "Are you sure you want to delete this generation record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((prev) =>
          prev.filter((generation) => generation.id !== record.id)
        );
      },
    });
  };

  const onEditGeneration = (record: Generation) => {
    setIsEditing(true);
    setEditingGeneration({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingGeneration(null);
  };

  return (
    <div className="App p-12">
      <header className="App-header">
        <div className="mb-10 font-bold text-3xl">Total generations</div>
        <Table columns={columns} dataSource={dataSource}></Table>
        <Modal
          open={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          // Modify okButtonProps to customize the OK button
          okButtonProps={{
            // Use Ant Design's Modal.confirm when OK button is clicked
            onClick: () => {
              Modal.confirm({
                title: "Are you sure you want to save changes?",
                okText: "Yes",
                okType: "primary",
                cancelText: "No",
                onOk: () => {
                  setDataSource((prev) =>
                    prev.map((generation) => {
                      if (generation.id === editingGeneration!.id) {
                        return editingGeneration!;
                      } else {
                        return generation;
                      }
                    })
                  );
                  resetEditing();
                },
              });
            },
          }}
        >
          <div className="font-bold text-3xl text-center">Edit generation</div>
          <div className="mb-4">
            <label className="block mb-2 font-bold">Prompt:</label>
            <Input
              value={editingGeneration?.prompt}
              onChange={(e) => {
                setEditingGeneration((prev) => ({
                  ...prev!,
                  prompt: e.target.value,
                }));
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold">Username:</label>
            <Input
              value={editingGeneration?.username}
              onChange={(e) => {
                setEditingGeneration((prev) => ({
                  ...prev!,
                  username: e.target.value,
                }));
              }}
            />
          </div>
        </Modal>
      </header>
    </div>
  );
}

export default GenerationsTable;
