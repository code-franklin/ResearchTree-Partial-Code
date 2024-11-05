import React, { useEffect, useState } from "react";
import "./register.css";
import axios from "axios";
import Course from "./Course";
import Year from "./Year";
import Role from "./Role";
import {
  LockOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Alert, Select } from "antd";

const { Option } = Select;

const LoginFunction = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "student",
    groupMembers: "",
    course: "",
    year: "",
    handleNumber: "",
    specializations: [],
  });
  const [specializationsOptions, setSpecializationsOptions] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleSpecializationChange = (selected) => {
    setFormData({ ...formData, specializations: selected });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:7000/api/advicer/register",
        formData
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  // Fetch specializations on mount
  useEffect(() => {
    axios
      .get("http://localhost:7000/api/advicer/specializations")
      .then((response) => {
        setSpecializationsOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching specializations:", error);
      });
  }, []);

  return (
    <div className='rectangle'>
      <h1 className='logintext'>
        REGISTER AS{" "}
        <span className='text-[#0BF677]'>{formData.role.toUpperCase()}</span>
      </h1>
      <h1 className='logintext2'>
        Fill in the details to create your account.
      </h1>

      <img className='studentgirl ' src='./src/assets/student.png' />
      <img className='leaves ' src='./src/assets/leaves.png' />
      <img className='green-background  ' src='./src/assets/gif.gif' />
      <img className='logorstree' src='./src/assets/LogoResearchTree.png' />
      <Form
        form={form}
        name='registration'
        autoComplete='off'
        layout='vertical'
        onFinish={handleSubmit}
        style={{ marginTop: "-450px", marginLeft: "60px" }}
      >
        <Form.Item
          name='username'
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input
            className='Username'
            prefix={<UserOutlined />}
            placeholder='Username'
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input
            className='Email'
            prefix={<UserOutlined />}
            placeholder='Email'
            onChange={handleChange}
          />
          <Input
            className='Password'
            prefix={<LockOutlined />}
            placeholder='Password'
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          name='confirmPassword'
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input
            className='Retype-Password '
            prefix={<LockOutlined />}
            placeholder='Re-type your password'
            onChange={handleChange}
          />
        </Form.Item>

        {/* Role Selection */}
        <Form.Item>
          <Select
            name='role'
            style={{ position: "absolute", width: "100px", marginTop: "46px" }}
            value={formData.role}
            onChange={handleRoleChange}
          >
            <Option value='student'>Student</Option>
            <Option value='adviser'>Adviser</Option>
          </Select>
        </Form.Item>

        {/* Conditional Fields */}
        {formData.role === "student" ? (
          <>
            <Input
              prefix={<UsergroupAddOutlined />}
              name='Group Members'
              className='GroupMembers absolute mt-[-60px]'
              placeholder='Group Members (comma separated)'
              onChange={handleChange}
            />

            <div name='Course' className='absolute ml-[110px] mt-[10px]'>
              {" "}
              <Course />{" "}
            </div>
            <div name='Year' className='absolute ml-[230px] mt-[-15px]'>
              {" "}
              <Year />{" "}
            </div>
          </>
        ) : (
          <>
            <Input
              prefix={<UserAddOutlined />}
              name='Handle'
              style={{
                position: "absolute",
                marginLeft: "110px",
                marginTop: "7px",
                width: "90px",
              }}
              placeholder='Handle'
              onChange={handleChange}
            />

            <Input
              prefix={<ProductOutlined />}
              name='Specializations'
              style={{
                position: "absolute",
                marginTop: "-60px",
                width: "364px",
                height: "52px",
                borderRadius: "20px",
                background: "#F0EDFFCC",
              }}
              mode='multiple'
              placeholder='Select Specializations'
              options={specializationsOptions}
              onChange={handleSpecializationChange}
            />
          </>
        )}

        <Button
          style={{
            width: "124px",
            height: "52px",
            marginLeft: "110px",
            marginTop: "50px",
            background: "#0BF677",
            borderRadius: "15px",
          }}
          onClick={handleSubmit}
        >
          <span className='text-white font-bold'>Register</span>
        </Button>
      </Form>
      {message && <Alert message={message} type='info' />}
    </div>
  );
};

export default LoginFunction;
