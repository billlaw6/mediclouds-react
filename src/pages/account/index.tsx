import React, { FunctionComponent, useState } from "react";
import useAccount from "_hooks/useAccount";
import { Upload, Button, Tabs, Form, Input, Select, DatePicker, Alert } from "antd";
import { RoleE } from "_types/account";

import moment from "antd/node_modules/moment";
import "./style.less";
import { WarningOutlined } from "@ant-design/icons";

const { Item: FormItem } = Form;
const { TabPane } = Tabs;

const Account: FunctionComponent = () => {
  const { account, updateAccount } = useAccount();

  console.log(">> account", account);

  const {
    avatar,
    first_name,
    last_name,
    business_name,
    role,
    cell_phone,
    certificate,
    age,
    sex,
    birthday,
    sign,
    nickname,
  } = account;

  const [files, setFiles] = useState();
  const [currentTab, setCurrentTab] = useState("info");

  return (
    <div className="account">
      {!certificate.length && role === RoleE.BUSINESS ? (
        <Alert type="warning" message="您的企业资质未上传或未通过审核，部分功能受限。">
          <WarningOutlined />
        </Alert>
      ) : null}
      <Tabs className="account-tabs" activeKey={currentTab} onChange={(val) => setCurrentTab(val)}>
        <TabPane key="info" tab="账户信息">
          <Form
            labelCol={{ span: 4 }}
            initialValues={{
              businessName: business_name,
              firstName: first_name,
              lastName: last_name,
              sex,
              birthday: moment(birthday),
              sign,
            }}
            onFinish={(val): Promise<void> =>
              updateAccount(val)
                .then(() => console.log("successed"))
                .catch((err) => console.error(err))
            }
          >
            {role === RoleE.BUSINESS ? (
              <FormItem className="account-item" label="企业名称" name="businessName">
                <Input></Input>
              </FormItem>
            ) : (
              <>
                <FormItem className="account-item" label="姓" name="firstName">
                  <Input></Input>
                </FormItem>
                <FormItem className="account-item" label="名" name="lastName">
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
        </TabPane>
        <TabPane key="avatar" tab="头像">
          <div
            className="account-avatar-current"
            style={{ backgroundImage: `url(${avatar})` }}
          ></div>
          <Upload action="/upload-avatar">
            <Button>选择头像</Button>
          </Upload>
          <Button type="primary">上传</Button>
        </TabPane>
        <TabPane key="username" tab="密码">
          <Form labelCol={{ span: 6 }}>
            <FormItem className="account-item" label="当前密码" name="currentPassword">
              <Input></Input>
            </FormItem>
            <FormItem className="account-item" label="新密码" name="password">
              <Input.Password></Input.Password>
            </FormItem>
            <FormItem className="account-item">
              <Button type="primary" htmlType="submit">
                更新密码
              </Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane key="cellPhone" tab="手机号">
          <Form labelCol={{ span: 5 }}>
            <FormItem className="account-item" label="手机号" name="cell_phone">
              <Input></Input>
            </FormItem>
            <FormItem className="account-item" label="验证码" name="auth_code">
              <Input suffix={<Button>获取验证码</Button>}></Input>
            </FormItem>
            <FormItem className="account-item">
              <Button type="primary">更新手机号</Button>
            </FormItem>
          </Form>
        </TabPane>
        {role === RoleE.BUSINESS ? (
          <TabPane key="cert" tab="企业资质">
            {certificate.length ? (
              <Upload>
                <Button>更新企业资质</Button>
              </Upload>
            ) : (
              <Upload>
                <Button>上传企业资质</Button>
              </Upload>
            )}
          </TabPane>
        ) : null}
      </Tabs>
    </div>
  );
};

export default Account;
