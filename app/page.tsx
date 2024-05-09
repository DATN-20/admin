"use client";

import React from "react";
import { Button, Checkbox, ConfigProvider, Form, Input } from "antd";

const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const Page: React.FC = () => (
  <ConfigProvider theme={{ cssVar: true }}>
    <div className="login-page bg-blue-100 min-h-screen flex justify-center items-center">
      <div className="login-box flex justify-between items-center flex-row-reverse  bg-white shadow-lg overflow-hidden rounded-lg mx-auto">
        <div className="illustration-wrapper flex items-end max-w-lg min-h-full bg-yellow-100">
          <img
            src="https://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700"
            alt="Login"
          />
        </div>
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="flex-1 flex flex-col "
          style={{ padding: "0 40px" }}
        >
          <p className="form-title text-3xl font-bold text-gray-700 mb-4">
            Welcome back
          </p>
          <p className="text-gray-600 mb-4">Login to the Dashboard</p>
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" className="py-3 px-4 rounded-md" />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              className="py-3 px-4 rounded-md"
            />
          </Form.Item>

          <Form.Item<FieldType> name="remember" valuePropName="checked">
            <Checkbox className="text-gray-700">Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button w-full py-3 rounded-md"
            >
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  </ConfigProvider>
);

export default Page;
