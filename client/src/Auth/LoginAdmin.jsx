import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import axios from "axios";
import "./loginAdmin.css";

const LoginFunction = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:7000/api/admin/login", {
        email,
        password,
      });

      if (res && res.data) {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setMessage("Login successful!"); /* 
        navigate('/AdminDashboard/'); */
        window.location.href = "/AdminDashboard/";
      } else {
        setMessage("Login failed: No response data");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "Unknown error";
      console.error("Error logging in:", errorMsg);
      setMessage("Login failed: " + errorMsg);
    }
  };

  return (
    <div className='rectangle'>
      <img
        className='studentgirl'
        src='./src/assets/student.png'
        alt='Student'
      />
      <img className='leaves' src='./src/assets/leaves.png' alt='Leaves' />
      <img
        className='green-background'
        src='./src/assets/gif.gif'
        alt='Background'
      />
      <h1 className='logintext'>Administrator</h1>
      <img
        className='logorstree'
        src='./src/assets/LogoResearchTree.png'
        alt='Logo'
      />

      <Form
        style={{
          position: "absolute",
          left: "50px",
          top: "300px",
          display: "block",
        }}
        name='login'
        layout='vertical'
        onFinish={handleSubmit}
      >
        <Form.Item
          name='email'
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder='Email'
            className='Username'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder='Password'
            className='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        {/*         <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button">
            Log In
          </Button>
        </Form.Item> */}

        <Button
          style={{
            width: "104px",
            height: "52px",
            marginLeft: "130px",
            marginTop: "12px",
            border: "none",
            background: "#0BF677",
            borderRadius: "20px",
          }}
          htmlType='submit'
        >
          <span
            style={{ color: "white", fontSize: "16px", fontWeight: "bolder" }}
          >
            Login
          </span>
        </Button>

        {message && (
          <p style={{ color: message.includes("failed") ? "red" : "green" }}>
            {message}
          </p>
        )}
      </Form>

      <h1 className='Register'>
        <span className='text1'>Don’t have an Account, contact the admin?</span>
      </h1>
    </div>
  );
};

export default LoginFunction;
