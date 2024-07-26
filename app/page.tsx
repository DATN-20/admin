"use client";

import React, { use, useEffect, useState } from "react";
import { Button, Checkbox, ConfigProvider, Form, Input } from "antd";
import { useLoginUserMutation } from "@/services/auth/authApi";
import { ErrorObject } from "@/types/ErrorObject";
import { toast } from "react-toastify";
import { setUser } from "@/features/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/types/LoginResponse";
import jwt from "jsonwebtoken";
import { DecodedToken } from "@/components/Sidebar";
import Image from "next/image";
import profilePic from "../public/admin.webp";

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

const Page: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [
    loginUser,
    {
      data: loginData,
      isSuccess: isLoginSuccess,
      isError: isLoginError,
      error: loginError,
      isLoading,
    },
  ] = useLoginUserMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onSubmit = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    setIsButtonDisabled(true);

    if (email && password) {
      const response = await loginUser({ email, password });

      if ((response as ErrorObject).error) {
        setIsButtonDisabled(false);
        toast.error((response as ErrorObject).error.data.message);
      } else {
        const loginResponse = response.data as LoginResponse;
        const decoded: DecodedToken = jwt.decode(
          loginResponse.access_token
        ) as DecodedToken;
        if (decoded.role?.toLowerCase() !== "admin") {
          toast.error("You are not authorized to access this page");
          setIsButtonDisabled(false);
        } else {
          setTimeout(() => {
            toast.success("Login Successfully");
          }, 500);

          dispatch(setUser({ token: loginResponse.access_token, name: "Hao" }));
          localStorage.setItem("token", loginResponse.access_token);
          router.push("/home");
        }
      }
    } else {
      toast.error("Please fill all Input field");
    }
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1500);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/home");
    }
  }, [router]);

  return (
    <ConfigProvider theme={{ cssVar: true }}>
      <div className="login-page bg-blue-100 min-h-screen flex justify-center items-center">
        <div className="login-box flex justify-between items-center flex-row-reverse  bg-white shadow-lg overflow-hidden rounded-lg mx-auto">
          <div className="illustration-wrapper flex items-end max-w-lg min-h-full bg-purple-100">
            <Image
              src={profilePic}
              alt="Login"
            />
          </div>
          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={() => onSubmit(formData)}
            className="flex-1 flex flex-col "
            style={{ padding: "0 40px" }}
          >
            <p className="form-title text-3xl font-bold text-gray-700 mb-4">
              Welcome back
            </p>
            <p className="text-gray-600 mb-4">Login to the Dashboard</p>
            <Form.Item<FieldType>
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                placeholder="Email"
                type="email"
                className="py-3 px-4 rounded-md"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                placeholder="Password"
                className="py-3 px-4 rounded-md"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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
                disabled={isButtonDisabled}
              >
                LOGIN
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Page;
