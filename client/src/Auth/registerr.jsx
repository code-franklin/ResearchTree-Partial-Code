import React, { useEffect, useState } from "react";
import "./register.css";

import Course from "./Course";
import Year from "./Year";
import Role from "./Role";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Form, Input, Alert, Typography } from "antd";

const LoginFunction = () => {
  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    profileImage: null,
    specializations: [],
    course: "", // For student course
    year: "", // For student year
    handleNumber: "", // For adviser handle number
    groupMembers: [], // New field for group members
  });
  const [specializationsOptions, setSpecializationsOptions] = useState([]);
  const [message, setMessage] = useState("");

  // Generate years from 1900 to 2100
  const startYear = 2000;
  const endYear = 2100;
  const yearOptions = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => ({
      value: startYear + i,
      label: startYear + i,
    })
  );

  const courseOptions = [
    { value: "BSIT", label: "BSIT" },
    { value: "BSCS", label: "BSCS" },
  ];

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/advicer/specializations"
        );
        setSpecializationsOptions(
          response.data.map((spec) => ({ value: spec.name, label: spec.name }))
        );
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };

    fetchSpecializations();
    setClientReady(true);
  }, []);
  const onFinish = (values) => {
    console.log("Finish:", values);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSpecializationsChange = (selectedOptions) => {
    setFormData({
      ...formData,
      specializations: selectedOptions.map((option) => option.value),
    });
  };

  const handleGroupMembersChange = (e) => {
    setFormData({
      ...formData,
      groupMembers: e.target.value.split(",").map((member) => member.trim()),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);
    data.append("profileImage", formData.profileImage);
    data.append("specializations", JSON.stringify(formData.specializations));
    data.append("course", formData.course);
    data.append("year", formData.year);
    data.append("handleNumber", formData.handleNumber);
    data.append("groupMembers", JSON.stringify(formData.groupMembers)); // Add group members

    try {
      const response = await axios.post(
        "http://localhost:7000/api/advicer/register",
        data
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error(error.response.data);
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className='rectangle'>
      <img className='studentgirl ' src='./src/assets/student.png' />
      <img className='leaves ' src='./src/assets/leaves.png' />
      <img className='green-background  ' src='./src/assets/gif.gif' />
      <h1 className='logintext'>
        REGISTER AS <span className='text-[#0BF677]'>STUDENT</span>{" "}
      </h1>
      <h1 className='logintext2'>
        Fill in the details to create your account.
      </h1>
      <img className='logorstree' src='./src/assets/LogoResearchTree.png' />

      <Form
        form={form}
        name='dependencies'
        autoComplete='off'
        style={{
          maxWidth: "364px",
          marginTop: "-450px",
          marginLeft: "56px",
        }}
        layout='vertical'
      >
        <Form.Item
          style={{ height: "46px" }}
          name='username'
          rules={[
            {
              required: true,
              message: "",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            className='Username'
            placeholder='Username'
          />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            className='Password'
            placeholder='Password'
          />
        </Form.Item>

        {/* Field */}
        {/* Field */}
        <Form.Item
          name='Confirm password'
          dependencies={["password"]}
          rules={[
            {
              required: true,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            className='Retype-Password'
            placeholder='Re-type your password'
          />
        </Form.Item>

        <div className='mt-[-7px]'>
          <Input
            prefix={<UserOutlined />}
            className='members1'
            placeholder='Group Members'
          />
          <Input
            prefix={<UserOutlined />}
            className='members2'
            placeholder='Group Members'
          />
        </div>

        <Course />
        <Year />
        <Role />
        <Button
          style={{
            width: "104px",
            height: "52px",
            marginLeft: "130px",
            marginTop: "20px",
            border: "none",
            background: "#0BF677",
            borderRadius: "20px",
          }}
          htmlType='submit'
        >
          <span
            style={{ color: "white", fontSize: "16px", fontWeight: "bolder" }}
          >
            Register
          </span>
        </Button>
      </Form>

      <h1 className='Register'>
        <span className='text1'>Don’t have an Account?</span>{" "}
        <span className='text2'>Sign up here</span>
      </h1>
    </div>
  );
};

export default LoginFunction;
