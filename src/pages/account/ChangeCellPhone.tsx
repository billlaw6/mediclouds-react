import React, { FunctionComponent, useState } from "react";
import { UserI } from "_types/account";
import { Store } from "antd/lib/form/interface";
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import { Input, Button } from "antd";
import Captcha from "_pages/login/Captcha";
import SmsCode from "_components/SmsCode";

interface ChangeCellPhonePropsI {
  account: UserI;
  onFinish: (vals: Store) => void;
}

const ChangeCellPhone: FunctionComponent<ChangeCellPhonePropsI> = (props) => {
  const { account, onFinish } = props;
  const { cell_phone } = account;

  const [cellPhone, setCellPhone] = useState("");
  const [captcha, setCaptcha] = useState("");

  return (
    <Form labelCol={{ span: 5 }} onFinish={onFinish}>
      <FormItem label="原手机号">{cell_phone}</FormItem>
      <FormItem className="account-item" label="新手机号" name="cell_phone">
        <Input onInput={(e): void => setCellPhone(e.currentTarget.value)}></Input>
      </FormItem>
      <SmsCode
        cell_phone={cellPhone}
        // captcha={captcha}
        className="account-item"
        loginType="phone"
      />
      {/* <Captcha className="account-item" onChecked={(val): void => setCaptcha(val)} /> */}
      <FormItem className="account-item">
        <Button type="primary">更新手机号</Button>
      </FormItem>
    </Form>
  );
};

export default ChangeCellPhone;
