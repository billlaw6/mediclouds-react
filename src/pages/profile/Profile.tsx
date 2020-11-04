import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import { Form, Input, Row, Col, Select, DatePicker } from "antd";

import DEFAULT_AVATAR from "_images/avatar.png";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

import useAccount from "_hooks/useAccount";
import { UserI } from "_types/account";
import moment from "antd/node_modules/moment";

import "./Profile.less";

const { Item } = Form;
const { Option } = Select;

const Profile: FunctionComponent = (props) => {
  const { account, updateAccount, fetchAccount } = useAccount();
  const $form = useRef<HTMLFormElement>(null);

  const [isEdit, setIsEdit] = useState(false); // 是否是编辑模式
  const [editedInfo, setEditedInfo] = useState<UserI & { [key: string]: any }>(); // 已修改的用户信息

  const getInfo = (key: string) => {
    const originRes = (account as UserI & { [key: string]: any })[key];

    if (editedInfo) {
      const res = editedInfo[key];
      if (!res) return originRes;
      else return;
    }

    return originRes;
  };

  const setInfo = (key: string, val: any): void => {
    const nextInfo = Object.assign({}, editedInfo, {
      [key]: val,
    });

    setEditedInfo(nextInfo);
  };

  // 取消修改
  const onCancel = (): void => {
    setEditedInfo(undefined);
    setIsEdit(false);
  };
  // 提交修改
  const onSubmit = (): void => {
    // if (!$form.current) return setIsEdit(false);
    // const formData = new FormData($form.current);
    /* ======== 此处添加update User Info action == START ======== */
    //  将 [formData] 作为 data
    /* ======== 此处添加update User Info action == END ======== */
    // console.group(">>>>>>>>> Form Data In Page <<<<<<<<");
    // formData.forEach((value, key) => {
    //   console.log(" Key: ", key, "  value: ", value);
    // });
    // console.groupEnd();

    // if (!(formData.get("avatar") as File).size) {
    //   formData.delete("avatar");
    // }

    // updateUserAction(formData);

    console.log("editedInfo", editedInfo);
    setIsEdit(false);
  };

  const previewAvatar = (e: React.FormEvent<HTMLInputElement>): void => {
    const $el = e.currentTarget;
    const { files } = $el;
    if (!files) return;

    const avatarData = files[0];

    console.log("avatarData", avatarData);
    if (!avatarData) return;
    // const url = URL.createObjectURL(avatarData);
    // console.log("url", url);
    setInfo("avatar", avatarData);
  };

  // 更新页面中的用户信息
  const updateInputVal = (e: React.FormEvent<HTMLInputElement>): void => {
    const $el = e.currentTarget;
    const { name, value } = $el;
    if (name === "sign" && value.length > 30) return;

    setInfo(name, value);
  };

  const updateInputWidthMaxTotal = (
    total: number,
    payload: { name: string; value: string },
  ): void => {
    const { name, value } = payload;
    if (value.length > total) return;

    setInfo(name, value);
  };

  /* effect */
  useEffect(() => {
    // ========= 登录profile页面 获取一次userInfo ======== //
    fetchAccount().then(
      () => {
        //
      },
      (err) => console.error(err),
    );
  }, []);

  console.log("AVATAR", getInfo("avatar"));

  /* render */
  return (
    <section className="profile">
      <div className="profile-header">
        <h1>个人信息</h1>
        <Link className="profile-back" to="/resources">
          <ArrowLeftOutlined className="iconfont"></ArrowLeftOutlined>
          <span>返回</span>
        </Link>
      </div>
      <div className="profile-content">
        <Form
          className="profile-form"
          name="profile"
          encType="multipart/form-data"
          method="post"
          initialValues={account}
        >
          <div className={`profile-form-header ${isEdit ? "profile-editing" : ""}`}>
            <Item className={`profile-form-avatar`}>
              {isEdit ? <span className="mask"></span> : null}
              <Input
                disabled={!isEdit}
                type="file"
                name="avatar"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                // accept="image/png"
                onChange={previewAvatar}
              />
              <img src={getInfo("avatar") || DEFAULT_AVATAR} alt="avatar" />
            </Item>
            <Item>
              <Input
                className="profile-form-btn profile-form-edit"
                style={{ visibility: "hidden" }}
                type="button"
                name="edit"
                value="编辑信息"
                onClick={(): void => setIsEdit(true)}
              ></Input>
            </Item>
            <div className="profile-form-avatar-desc">
              <span>选择新头像</span>
            </div>
          </div>
          <div className="profile-form-info">
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
                      console.log("date", date.toString());
                      if (date && moment(date as any).isBetween("1900-01-01", moment()))
                        return false;
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
                  <span className="text-count">
                    {getInfo("sign") ? getInfo("sign").length : 0}/20
                  </span>
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
                  <span className="text-count">
                    {getInfo("unit") ? getInfo("unit").length : 0}/20
                  </span>
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
          </div>
        </Form>
      </div>
    </section>
  );
};

export default Profile;
