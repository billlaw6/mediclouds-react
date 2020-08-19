import React, { ReactElement } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { connect } from "react-redux";
import { StoreStateI } from "_types/core";
import {
  setTokenAction,
  setUserAction,
  SetTokenActionFuncI,
  SetUserActionFuncT,
} from "_actions/user";
import { loginUser, getUserInfo } from "_api/user";
import { history } from "../../store/configureStore";
import "./Login.less";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

class LoginForm extends React.Component<MapDispatchToPropsI> {
  handleSubmit = (values: any): void => {
    const { setTokenAction } = this.props;
    // e.preventDefault();

    setTokenAction("");
    loginUser(values)
      .then((res) => {
        console.log(res);
        setTokenAction(res.data.key);
        history.replace("/");
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log(e);
    // this.props.form.validateFields((err: any, values: any) => {
    //   if (!err) {
    //     console.log("Received values of form: ", values);
    //     setTokenAction("");
    //     loginUser(values)
    //       .then((res) => {
    //         console.log(res);
    //         setTokenAction(res.data.key);
    //         // history.replace("/");
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   }
    // });
  };

  fetchUserInfo = (): void => {
    const { setUserAction } = this.props;
    getUserInfo()
      .then((res) => {
        console.log(res.data);
        setUserAction(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render(): ReactElement {
    // const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <div className="login-form">
          <Form onFinish={this.handleSubmit} className="login-form">
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
          <Button onClick={this.fetchUserInfo}>UserInfo</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStateI) => {
  return {
    user: state.user,
  };
};

interface MapDispatchToPropsI {
  setTokenAction: SetTokenActionFuncI;
  setUserAction: SetUserActionFuncT;
}

const mapDispatchToProps = {
  setTokenAction: setTokenAction,
  setUserAction: setUserAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
