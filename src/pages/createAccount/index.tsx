import React, { FunctionComponent, ReactNode } from "react";
import { AccountTypeE, CustomerTypeE } from "_types/api";
import useAccount from "_hooks/useAccount";
import { Form, Input, Radio, Button } from "antd";
import { useHistory } from "react-router";

import "./style.less";

const { Item: FormItem } = Form;

const ManagerCreateAccount: FunctionComponent = (props) => {
  const history = useHistory();
  const { account } = useAccount();
  const { role } = account;

  // if (
  //   role === AccountTypeE.EMPLOYEE ||
  //   role === CustomerTypeE.PATIENT ||
  //   role === CustomerTypeE.DOCTOR
  // )
  // history.goBack();

  const getRadioItem = (): ReactNode => {
    const SuperStaff = (
      <Radio.Button key="super-employee-account" value={AccountTypeE.MANAGER}>
        经理账户
      </Radio.Button>
    );
    const Business = (
      <Radio.Button key="business-accout" value={AccountTypeE.BUSINESS}>
        企业账户
      </Radio.Button>
    );
    const Staff = (
      <Radio.Button key="employee-account" value={AccountTypeE.EMPLOYEE}>
        员工账户
      </Radio.Button>
    );

    if (role === AccountTypeE.BUSINESS) return [SuperStaff, Staff];
    if (role === AccountTypeE.SUPER_ADMIN) return [Business, SuperStaff, Staff];

    return Staff;
  };

  const onSubmit = (vals: any): void => {
    /* 发送创建账户的API */
    console.log("vals", vals);
  };

  return (
    <div className="manager-create-account">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
        initialValues={{ username: "", password: "", accountType: AccountTypeE.EMPLOYEE }}
        onFinish={onSubmit}
      >
        <FormItem label="账户类型" name="accountType" required>
          <Radio.Group>{getRadioItem()}</Radio.Group>
        </FormItem>
        <FormItem label="用户名" name="username" required>
          <Input></Input>
        </FormItem>
        <FormItem label="密码" name="password" required>
          <Input></Input>
        </FormItem>
        <FormItem label="邮件" name="email" required>
          <Input type="email"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            创建
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export default ManagerCreateAccount;
