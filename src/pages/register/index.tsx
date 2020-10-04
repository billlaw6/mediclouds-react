import React, { FunctionComponent, useState } from "react";
import { Button, Form, Input, Result } from "antd";
import getQueryString from "_helper";
import SmsCode from "_components/SmsCode";
import useAccount from "_hooks/useAccount";
import { RegisterDataI } from "_types/api";
import { CheckCircleTwoTone } from "@ant-design/icons";

import "./style.less";

const { Item: FormItem } = Form;

const Register: FunctionComponent = () => {
  const query = getQueryString();
  const { register } = useAccount();
  const { id, name } = query;
  const [formData, setFormData] = useState<any>({});
  const [result, setResult] = useState<{ status: "success" | "error"; text?: string }>();

  const onFinish = (vals: any) => {
    const { cell_phone, auth_code } = vals;

    const data: RegisterDataI = {
      cell_phone,
      auth_code,
      account_id: id,
    };
    register(data)
      .then(() => setResult({ status: "success" }))
      .catch((err) => setResult({ status: "error", text: err }));
  };

  return (
    <div className="register">
      {result ? (
        <Result
          status={result.status}
          title={result.status === "success" ? "创建成功！" : "创建失败"}
          subTitle={result.text}
        ></Result>
      ) : (
        <Form
          labelCol={{ span: 1 }}
          onFinish={onFinish}
          onValuesChange={(vals) => {
            console.log("vals", vals);
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
            rules={[
              { required: true, message: "请输入正确的手机号", len: 11, pattern: /^1[3-9]\d{9}$/ },
            ]}
          >
            <Input maxLength={11}></Input>
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
      )}
    </div>
  );
};

export default Register;
