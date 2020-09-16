import React, { FunctionComponent, useState } from "react";
import { Button, Form, Input } from "antd";
import getQueryString from "_helper";
import SmsCode from "_components/SmsCode";
import useAccount from "_hooks/useAccount";
import { RegisterDataI } from "_types/api";

import "./style.less";

const { Item: FormItem } = Form;

const Register: FunctionComponent = () => {
  const query = getQueryString();
  const { register } = useAccount();
  const { id, name } = query;
  const [formData, setFormData] = useState<any>({});

  const onFinish = (vals: any) => {
    const { cell_phone, auth_code } = vals;

    const data: RegisterDataI = {
      cell_phone,
      auth_code,
      recommender_id: id,
    };
    register(data)
      .then(() => console.log("register successed"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="register">
      <Form
        labelCol={{ span: 1 }}
        onFinish={onFinish}
        onValuesChange={(vals) => {
          setFormData(Object.assign({}, formData, vals));
        }}
      >
        <FormItem className="register-item" label="推荐人">
          {name || "无推荐人"}
        </FormItem>
        <FormItem
          className="register-item"
          label="手机号"
          name="cell_phone"
          rules={[{ required: true, message: "请输入手机号" }]}
        >
          <Input></Input>
        </FormItem>
        <FormItem className="register-item" name="auth_code">
          <SmsCode loginType="phone" cell_phone={formData["cell_phone"]}></SmsCode>
        </FormItem>
        <FormItem className="register-item">
          <Button htmlType="submit" type="primary">
            注册
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export default Register;
