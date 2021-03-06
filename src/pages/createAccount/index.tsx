import React, { FunctionComponent, ReactNode, useState } from "react";
import useAccount from "_hooks/useAccount";
import { Form, Input, Radio, Button, Result } from "antd";
import { useHistory } from "react-router";

import { createUser, RoleE } from "mc-api";

import "./style.less";

const { Item: FormItem } = Form;

const ManagerCreateAccount: FunctionComponent = () => {
  const history = useHistory();
  const { account } = useAccount();
  const { role } = account;

  const [selectedRole, setSelectedRole] = useState(
    role === RoleE.SUPER_ADMIN ? RoleE.BUSINESS : RoleE.EMPLOYEE,
  );
  const [createStatus, setCreateStatus] = useState<"none" | "successed" | "error">("none");

  if (role === RoleE.EMPLOYEE || role === RoleE.PATIENT || role === RoleE.DOCTOR) history.goBack();

  const getRadioItem = (): ReactNode => {
    const ManagerAccount = (
      <Radio.Button key="super-employee-account" value={RoleE.MANAGER}>
        经理账户
      </Radio.Button>
    );
    const Business = (
      <Radio.Button key="business-accout" value={RoleE.BUSINESS}>
        企业账户
      </Radio.Button>
    );
    const Employee = (
      <Radio.Button key="employee-account" value={RoleE.EMPLOYEE}>
        员工账户
      </Radio.Button>
    );

    switch (role) {
      case RoleE.SUPER_ADMIN: {
        return [Business];
      }
      case RoleE.BUSINESS: {
        return [ManagerAccount, Employee];
      }
      case RoleE.MANAGER: {
        return [Employee];
      }
      default:
        return [];
    }
  };

  const onSubmit = (vals: any): void => {
    /* 发送创建账户的API */
    createUser(vals)
      .then((res) => {
        setCreateStatus("successed");
      })
      .catch((err) => {
        console.error(err);
        setCreateStatus("error");
      });
  };

  if (createStatus !== "none")
    return (
      <Result
        status={createStatus === "successed" ? "success" : "error"}
        title={createStatus === "successed" ? "创建账户成功！" : "创建账户失败"}
        extra={[
          <Button key="goback" type="primary" onClick={(): void => setCreateStatus("none")}>
            返回
          </Button>,
        ]}
      ></Result>
    );

  return (
    <div className="manager-create-account">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
        initialValues={{
          username: "",
          password: "",
          role: selectedRole,
        }}
        onFinish={onSubmit}
      >
        <FormItem label="账户类型" name="role" required>
          <Radio.Group onChange={(e): void => setSelectedRole(e.target.value)}>
            {getRadioItem()}
          </Radio.Group>
        </FormItem>
        <FormItem label="用户名" name="username" required>
          <Input></Input>
        </FormItem>
        <FormItem label="密码" name="password" required>
          <Input></Input>
        </FormItem>
        <FormItem label="手机号" name="cell_phone" required>
          <Input></Input>
        </FormItem>
        {selectedRole === RoleE.BUSINESS ? (
          <>
            <FormItem label="企业名称" name="business_name" required>
              <Input></Input>
            </FormItem>
            <FormItem label="企业社会信用代码" name="license_no" required>
              <Input></Input>
            </FormItem>
          </>
        ) : (
          <>
            <FormItem label="昵称" name="nickname">
              <Input type="text"></Input>
            </FormItem>
            <FormItem label="姓" name="first_name" required>
              <Input type="text"></Input>
            </FormItem>
            <FormItem label="名" name="last_name" required>
              <Input type="text"></Input>
            </FormItem>
          </>
        )}
        <FormItem label="邮箱" name="email">
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
