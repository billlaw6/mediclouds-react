import React, { FunctionComponent } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { useDispatch } from "react-redux";
import { setTokenAction, setUserAction } from "_actions/user";
import { loginUser, getUserInfo } from "_api/user";

import "./Login.less";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";

const LoginForm: FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (values: any): void => {
    dispatch(setTokenAction(""));
    loginUser(values)
      .then((res) => {
        console.log(res);
        dispatch(setTokenAction(res.key));
        history.replace("/resources");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUserInfo = (): void => {
    getUserInfo()
      .then((res) => {
        console.log(res.data);
        dispatch(setUserAction(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="login">
      <div className="login-form">
        <Form onFinish={handleSubmit} className="login-form">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }}></UserOutlined>}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }}></LockOutlined>}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item initialValue={true} valuePropName="checked" name="remember">
            <Checkbox>Remember me</Checkbox>
            <a className="login-form-forgot" href="">
              Forgot password
            </a>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div>
        <Button onClick={fetchUserInfo}>UserInfo</Button>
      </div>
    </div>
  );
};

export default LoginForm;
