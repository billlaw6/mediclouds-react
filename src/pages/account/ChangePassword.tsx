import React, { FunctionComponent } from "react";
import { AccountI } from "_types/account";
import { Store } from "antd/lib/form/interface";
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import { Input, Button } from "antd";
import Captcha from "_pages/login/Captcha";

interface ChangePasswordPropsI {
  account: AccountI;
  onFinish: (vals: Store) => void;
}

const ChangePassword: FunctionComponent<ChangePasswordPropsI> = (props) => {
  const { onFinish } = props;

  return (
    <Form labelCol={{ span: 6 }} onFinish={onFinish}>
      <FormItem className="account-item" label="当前密码" name="currentPassword">
        <Input></Input>
      </FormItem>
      <FormItem className="account-item" label="新密码" name="password">
        <Input.Password></Input.Password>
      </FormItem>
      <Captcha className="account-item" />
      <FormItem className="account-item">
        <Button type="primary" htmlType="submit">
          更新密码
        </Button>
      </FormItem>
    </Form>
  );
};

export default ChangePassword;
