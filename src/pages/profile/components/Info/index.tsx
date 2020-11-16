import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import moment from "antd/node_modules/moment";
import React, { FunctionComponent, useEffect, useState } from "react";
import useAccount from "_hooks/useAccount";
import { UserI } from "_types/account";
import DEFAULT_AVATAR from "_images/avatar.png";

const { Item: FormItem } = Form;
const { Option } = Select;

interface InfoPropsI {
  data: UserI;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Info: FunctionComponent<InfoPropsI> = (props) => {
  const { data } = props;

  const { birthday } = data;

  const { fetchAccount } = useAccount();

  // const [isEdit, setIsEdit] = useState(false); // 是否是编辑模式
  // const [editedInfo, setEditedInfo] = useState<UserI & { [key: string]: any }>(); // 已修改的用户信息

  // const getInfo = (key: string) => {
  //   const originRes = (data as UserI & { [key: string]: any })[key];

  //   if (editedInfo) {
  //     const res = editedInfo[key];
  //     if (!res) return originRes;
  //     else return;
  //   }

  //   return originRes;
  // };

  // const setInfo = (key: string, val: any): void => {
  //   const nextInfo = Object.assign({}, editedInfo, {
  //     [key]: val,
  //   });

  //   setEditedInfo(nextInfo);
  // };

  // // 取消修改
  // const onCancel = (): void => {
  //   setEditedInfo(undefined);
  //   setIsEdit(false);
  // };

  // // 提交修改
  // const onSubmit = (): void => {
  //   // if (!$form.current) return setIsEdit(false);
  //   // const formData = new FormData($form.current);
  //   /* ======== 此处添加update User Info action == START ======== */
  //   //  将 [formData] 作为 data
  //   /* ======== 此处添加update User Info action == END ======== */
  //   // console.group(">>>>>>>>> Form Data In Page <<<<<<<<");
  //   // formData.forEach((value, key) => {
  //   //   console.log(" Key: ", key, "  value: ", value);
  //   // });
  //   // console.groupEnd();

  //   // if (!(formData.get("avatar") as File).size) {
  //   //   formData.delete("avatar");
  //   // }

  //   // updateUserAction(formData);

  //   setIsEdit(false);
  // };

  // const previewAvatar = (e: React.FormEvent<HTMLInputElement>): void => {
  //   const $el = e.currentTarget;
  //   const { files } = $el;
  //   if (!files) return;

  //   const avatarData = files[0];

  //   if (!avatarData) return;
  //   // const url = URL.createObjectURL(avatarData);
  //   // console.log("url", url);
  //   setInfo("avatar", avatarData);
  // };

  // const updateInputWidthMaxTotal = (
  //   total: number,
  //   payload: { name: string; value: string },
  // ): void => {
  //   const { name, value } = payload;
  //   if (value.length > total) return;

  //   setInfo(name, value);
  // };

  // // 更新页面中的用户信息
  // const updateInputVal = (e: React.FormEvent<HTMLInputElement>): void => {
  //   const $el = e.currentTarget;
  //   const { name, value } = $el;
  //   if (name === "sign" && value.length > 30) return;

  //   setInfo(name, value);
  // };

  // /* effect */
  // useEffect(() => {
  //   // ========= 登录profile页面 获取一次userInfo ======== //
  //   fetchAccount().then(
  //     () => {
  //       //
  //     },
  //     (err) => console.error(err),
  //   );
  // }, []);

  return (
    <Form
      className="profile-form"
      name="profile"
      encType="multipart/form-data"
      method="post"
      initialValues={Object.assign({}, data, {
        birthday: moment(birthday),
      })}
      onFinish={(val) => console.log("finish", val)}
      {...layout}
    >
      <Row>
        <Col span={12}>
          <FormItem label="姓" name="first_name">
            <Input></Input>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="名" name="last_name">
            <Input></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="昵称" name="nickname">
            <Input></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="性别" name="sex">
            <Select dropdownClassName="profile-form-sex">
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
            ></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="个性签名" name="sign">
            <Input.TextArea maxLength={20}></Input.TextArea>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="通讯地址" name="address">
            <Input.TextArea maxLength={20}></Input.TextArea>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="就职单位" name="unit">
            <Input.TextArea maxLength={40}></Input.TextArea>
          </FormItem>
        </Col>
      </Row>
      <FormItem>
        <Button htmlType="submit" type="primary">
          更新个人信息
        </Button>
      </FormItem>

      <FormItem>
        <Button htmlType="reset" type="default">
          重置
        </Button>
      </FormItem>
      {/* <div className="profile-form-info">
        <Row gutter={22}>
          <Col span={12}>
            <Item className="profile-form-item" label="姓名" colon={false}>
              <Input
                disabled={!isEdit}
                type="text"
                name="nickname"
                value={getInfo("nickname")}
                onInput={(e): void =>
                  updateInputWidthMaxTotal(15, {
                    name: e.currentTarget.name,
                    value: e.currentTarget.value,
                  })
                }
                suffix={
                  <span className="text-count">
                    {getInfo("nickname") ? getInfo("nickname").length : 0}/15
                  </span>
                }
              />
            </Item>
          </Col>
          <Col span={12}>
            <Item className="profile-form-item" label="积分" colon={false}>
              <Input disabled={!isEdit} value={getInfo("score")}></Input>
            </Item>
          </Col>
        </Row>
        <Row className="profile-hoz profile-form-item" gutter={22}>
          <Col span={12}>
            <Item label="性别" colon={false}>
              <Select
                dropdownClassName="profile-form-sex"
                disabled={!isEdit}
                value={getInfo("sex")}
                onChange={(value: number): void => setInfo("sex", value)}
              >
                <Option value={0}>保密</Option>
                <Option value={1}>男</Option>
                <Option value={2}>女</Option>
              </Select>
              <Input
                style={{ display: "none" }}
                type="text"
                name="sex"
                value={getInfo("sex")}
                onChange={updateInputVal}
              ></Input>
            </Item>
          </Col>
          <Col span={12}>
            <Item label="出生日期" colon={false}>
              <DatePicker
                className="profile-form-birthday"
                disabled={!isEdit}
                disabledDate={(date): boolean => {
                  if (date && moment(date as any).isBetween("1900-01-01", moment())) return false;
                  return true;
                }}
                value={getInfo("birthday") ? moment(getInfo("birthday")) : undefined}
                onChange={(_date, dateString: string): void => {
                  setInfo("birthday", dateString);
                }}
              ></DatePicker>
              <Input
                style={{ display: "none" }}
                type="string"
                name="birthday"
                value={getInfo("birthday")}
                onInput={updateInputVal}
              ></Input>
            </Item>
          </Col>
        </Row>
        <Item className="profile-form-item" label="个性签名" colon={false}>
          <Input
            placeholder="未填写"
            disabled={!isEdit}
            type="text"
            name="sign"
            value={getInfo("sign")}
            onInput={(e): void =>
              updateInputWidthMaxTotal(20, {
                name: e.currentTarget.name,
                value: e.currentTarget.value,
              })
            }
            suffix={
              <span className="text-count">{getInfo("sign") ? getInfo("sign").length : 0}/20</span>
            }
          />
        </Item>
        <Item className="profile-form-item" label="通讯地址" colon={false}>
          <Input
            placeholder="未填写"
            disabled={!isEdit}
            type="text"
            name="address"
            value={getInfo("address")}
            onInput={(e): void =>
              updateInputWidthMaxTotal(20, {
                name: e.currentTarget.name,
                value: e.currentTarget.value,
              })
            }
            suffix={
              <span className="text-count">
                {getInfo("address") ? getInfo("address").length : 0}/20
              </span>
            }
          />
        </Item>
        <Item className="profile-form-item" label="就职单位" colon={false}>
          <Input
            placeholder="未填写"
            disabled={!isEdit}
            type="text"
            name="unit"
            value={getInfo("unit")}
            onInput={(e): void =>
              updateInputWidthMaxTotal(20, {
                name: e.currentTarget.name,
                value: e.currentTarget.value,
              })
            }
            suffix={
              <span className="text-count">{getInfo("unit") ? getInfo("unit").length : 0}/20</span>
            }
          />
        </Item>
        <Item className="profile-form-item" label="手机" colon={false}>
          <Input
            disabled={true}
            type="number"
            name="cell_phone"
            value={getInfo("cell_phone")}
            onInput={updateInputVal}
          />
        </Item>
        <Row
          className="profile-form-btns"
          gutter={35}
          align="middle"
          justify="center"
          style={{ visibility: isEdit ? "visible" : "hidden" }}
        >
          <Col span={5}>
            <Item>
              <Input
                className="profile-form-btn profile-form-cancel"
                type="button"
                name="cancel"
                value="取消"
                onClick={onCancel}
              ></Input>
            </Item>
          </Col>
          <Col span={5}>
            <Item>
              <Input
                className="profile-form-btn profile-form-submit"
                type="button"
                name="submit"
                value="保存"
                onClick={onSubmit}
              ></Input>
            </Item>
          </Col>
        </Row>
      </div> */}
    </Form>
  );
};

export default Info;
