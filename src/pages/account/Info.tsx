import React, { FunctionComponent } from "react";
import { AccountI, RoleE } from "_types/account";
import { Store } from "antd/lib/form/interface";
import Form from "antd/lib/form/Form";
import moment from "antd/node_modules/moment";
import FormItem from "antd/lib/form/FormItem";
import { Input, Select, DatePicker, Button } from "antd";

interface InfoPropsI {
  account: AccountI;
  onFinish: (vals: Store) => void;
}

const Info: FunctionComponent<InfoPropsI> = (props) => {
  const { account, onFinish } = props;

  const { first_name, last_name, business_name, role, age, sex, birthday, sign } = account;

  return (
    <Form
      labelCol={{ span: 6 }}
      initialValues={{
        businessName: business_name,
        firstName: first_name,
        lastName: last_name,
        sex,
        birthday: moment(birthday),
        sign,
      }}
      onFinish={onFinish}
    >
      {role === RoleE.BUSINESS ? (
        <FormItem className="account-item" label="企业名称" name="businessName">
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
