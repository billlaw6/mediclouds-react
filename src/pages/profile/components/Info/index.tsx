import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import moment from "antd/node_modules/moment";
import React, { FunctionComponent, useCallback, useState } from "react";
import { UserI } from "_types/account";
import { formatDate } from "_helper";
import useAccount from "_hooks/useAccount";

const { Item: FormItem } = Form;
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface InfoPropsI {
  onSuccessed?: Function;
  onFailed?: (err: string) => void;
}

const Info: FunctionComponent<InfoPropsI> = (props) => {
  const { onFailed, onSuccessed } = props;

  const { account, updateAccount } = useAccount();
  const { birthday, id } = account;

  const [preInfo, setPreInfo] = useState<{ [key: string]: any }>({});
  const [form] = Form.useForm();

  const getInfo = useCallback(
    (key: string): any => {
      const info = Object.assign({}, account, preInfo);
      return info[key];
    },
    [account, preInfo],
  );

  const setInfo = (key: string, val: any): void => {
    const nextInfo = Object.assign({}, preInfo, {
      [key]: val,
    });

    setPreInfo(nextInfo);
  };

  const update = (): void => {
    updateAccount(preInfo, id)
      .then(() => onSuccessed && onSuccessed())
      .catch((err) => onFailed && onFailed(err));
  };

  const reset = () => {
    setPreInfo({});
    form.resetFields();
  };

  return (
    <Form
      className="profile-form"
      name="profile"
      encType="multipart/form-data"
      method="post"
      initialValues={Object.assign({}, account, {
        birthday: moment(birthday),
      })}
      onValuesChange={(res) => {
        const key = Object.keys(res)[0];
        let val = res[key];

        switch (key) {
          // 转化生日 moment --> string
          case "birthday":
            val = formatDate(val);
            break;
          case "sex":
            val = parseInt(val, 10);
            break;
          default:
            break;
        }

        setInfo(key, val);
      }}
      onFinish={update}
      {...layout}
      form={form}
    >
      <Row>
        <Col span={12}>
          <FormItem label="姓" name="first_name">
            <Input value={getInfo("first_name")}></Input>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="名" name="last_name">
            <Input value={getInfo("last_name")}></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="昵称" name="nickname">
            <Input
              value={getInfo("nickname")}
              maxLength={15}
              suffix={
                <span className="text-count">
                  {getInfo("nickname") ? getInfo("nickname").length : 0}/15
                </span>
              }
            ></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="性别" name="sex">
            <Select dropdownClassName="profile-form-sex" value={getInfo("sex")}>
              <Option value={0}>保密</Option>
              <Option value={1}>男</Option>
              <Option value={2}>女</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="生日" name="birthday">
            <DatePicker
              className="profile-form-birthday"
              disabledDate={(date): boolean => {
                if (date && moment(date as any).isBetween("1900-01-01", moment())) return false;
                return true;
              }}
              value={moment(getInfo("birthday"))}
            ></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="个性签名" name="sign">
            <Input.TextArea maxLength={20} value={getInfo("sign")}></Input.TextArea>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="通讯地址" name="address">
            <Input.TextArea maxLength={20} value={getInfo("address")}></Input.TextArea>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="就职单位" name="unit">
            <Input.TextArea maxLength={40} value={getInfo("unit")}></Input.TextArea>
          </FormItem>
        </Col>
      </Row>
      <div
        className="controller"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Space>
          <FormItem>
            <Button htmlType="submit" type="primary">
              更新个人信息
            </Button>
          </FormItem>
          <FormItem>
            <Button htmlType="reset" type="default" onClick={reset}>
              重置
            </Button>
          </FormItem>
        </Space>
      </div>
    </Form>
  );
};

export default Info;
