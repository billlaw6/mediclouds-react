import React, { ReactElement } from "react";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { connect } from "react-redux";
import { FormComponentProps } from "antd/es/form";
import { StoreStateI } from "_constants/interface";
import {
  setTokenAction,
  setUserAction,
  SetTokenActionFuncI,
  SetUserActionFuncT,
} from "_actions/user";
import { loginUser } from "_services/user";
import { history } from "../../store/configureStore";
import "./Login.less";

class LoginForm extends React.Component<FormComponentProps & MapDispatchToPropsI> {
  handleSubmit = (e: any): void => {
    const { setTokenAction } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log("Received values of form: ", values);
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
      }
    });
  };

  render(): ReactElement {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "Please input your username!" }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your Password!" }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("remember", {
            valuePropName: "checked",
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedLoginForm = Form.create({ name: "normal_login" })(LoginForm);

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

export default connect(mapStateToProps, mapDispatchToProps)(WrappedLoginForm);
