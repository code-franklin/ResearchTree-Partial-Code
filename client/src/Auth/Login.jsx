import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import axios from "axios";
import ViewAnalytics from "../Dashboards/StudentDashboard/ViewAnalytics/ViewAnalyticsComponent";
import "./login.css";

const LoginFunction = () => {
  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("user"));
    if (items) {
      setItems(items);
    }
  }, []);

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:7000/api/advicer/login",
        {
          email: values.username,
          password: values.password,
        }
      );

      const { user } = response.data;
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on user role
      if (user.role === "student") {
        window.location.href = "/StudentDashboard/"; // Update the path based on your routing setup
      } else if (user.role === "adviser") {
        /* 
        navigate('/AdviserDashboard/'); */
        window.location.href = "/AdviserDashboard/"; // Update the path based on your routing setup
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErrorMessage("Your account is awaiting admin approval.");
      } else if (error.response && error.response.status === 400) {
        setErrorMessage("Invalid credentials.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    setClientReady(true);
  }, []);

  // Sorry about that. I. useEffect(() => {
  //   if (items.name ){
  //     return navigate('/StudentDashboard/');
  //   }
  // },[])

  console.log(items.email);

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
      <h1 className='logintext ml-[65px] '>Sign in</h1>
      <h1 className='logintext2'>Explore more manuscripts</h1>
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
        form={form}
        name='horizontal_login'
        layout='inline'
        onFinish={handleLogin}
      >
        <Form.Item
          style={{ height: "66px" }}
          name='username'
          rules={[
            {
              required: true,
              message: "Please input your username!",
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
              message: "Please input your password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            className='Username'
            type='password'
            placeholder='Password'
          />
        </Form.Item>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {items.email ? (
          <Form.Item shouldUpdate>
            {() => (
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
                disabled={
                  !clientReady ||
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                {items.role === "student"
                  ? navigate("/StudentDashboard/")
                  : navigate("/AdviserDashboard/")}
              </Button>
            )}
          </Form.Item>
        ) : (
          <Form.Item shouldUpdate>
            {() => (
              <Button
                style={{
                  width: "104px",
                  height: "52px",
                  marginLeft: "135px",
                  marginTop: "12px",
                  border: "none",
                  background: "#0BF677",
                  borderRadius: "20px",
                }}
                htmlType='submit'
                disabled={
                  !clientReady ||
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                <span
                  style={{
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bolder",
                   
                  }}
                >
                  Login
                </span>
              </Button>
            )}
          </Form.Item>
        )}
      </Form>

      <h1 className='Register'>
        <span className='text1'>Don’t have an Account?</span>{" "}
        <Link to='/Register' className='text2'>
          Sign up here
        </Link>
      </h1>
    </div>
  );
};

export default LoginFunction;
