import React, { FunctionComponent } from "react";
import { UserI, RoleE } from "_types/account";
import { Store } from "antd/lib/form/interface";
import { Input, Select, DatePicker, Button, Form } from "antd";
import moment from "moment";

const { Item: FormItem } = Form;

interface InfoPropsI {
  account: UserI;
  onFinish: (vals: Store) => void;
}

const Info: FunctionComponent<InfoPropsI> = (props) => {
  const { account, onFinish } = props;

  const {
    first_name = "",
    last_name = "",
    business_name = "",
    role,
    nickname = "",
    age,
    sex,
    birthday,
    sign,
  } = account;

  return (
    <Form
      labelCol={{ span: 6 }}
      initialValues={{
        business_name: business_name,
        first_name,
        last_name,
        sex,
        birthday: moment(birthday || "1900-01-01"),
        sign,
        nickname,
      }}
      onFinish={onFinish}
    >
      {role === RoleE.BUSINESS ? (
        <FormItem className="account-item" label="企业名称" name="business_name">
          <Input></Input>
        </FormItem>
      ) : (
        <>
          <FormItem className="account-item" label="姓" name="first_name">
            <Input></Input>
          </FormItem>
          <FormItem className="account-item" label="名" name="last_name">
            <Input></Input>
          </FormItem>
          <FormItem className="account-item" label="昵称" name="nickname">
            <Input></Input>
          </FormItem>
          <FormItem label="性别" name="sex" className="account-item">
            <Select>
              <Select.Option value={0}>保密</Select.Option>
              <Select.Option value={1}>男</Select.Option>
              <Select.Option value={2}>女</Select.Option>
            </Select>
          </FormItem>
          <FormItem label="年龄" className="account-item">
            {age}
          </FormItem>
          <FormItem label="生日" name="birthday" className="account-item">
            <DatePicker></DatePicker>
          </FormItem>
          <FormItem label="签名" name="sign" className="account-item">
            <Input></Input>
          </FormItem>
        </>
      )}
      <FormItem className="account-item">
        <Button type="primary" htmlType="submit">
          更新信息
        </Button>
      </FormItem>
    </Form>
  );
};

export default Info;
