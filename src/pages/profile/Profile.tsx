import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import { Form, Input, Row, Col, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { Moment } from "moment";
import { connect, useDispatch } from "react-redux";

import { StoreStateI } from "_types/core";
import { MapStateToPropsI, MapDispatchToPropsI } from "./type";

import DEFAULT_AVATAR from "_images/avatar.png";
import { updateUserAction, setUserAction } from "_actions/user";
import { getUserInfo } from "_api/user";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

import "./Profile.less";

const { Item } = Form;
const { Option } = Select;

const Profile: FunctionComponent<MapStateToPropsI & MapDispatchToPropsI> = (props) => {
  const { user, updateUserAction } = props;
  const $form = useRef<HTMLFormElement>(null);

  const [userInfo, setUserInfo] = useState(user); // 网页中的用户信息 默认为服务器端用户信息
  const [isEdit, setIsEdit] = useState(false); // 是否是编辑模式

  const dispatch = useDispatch();

  // 取消修改
  const onCancel = (): void => {
    setUserInfo(user);
    setIsEdit(false);
  };
  // 提交修改
  const onSubmit = (): void => {
    if (!$form.current) return setIsEdit(false);
    const formData = new FormData($form.current);
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

    updateUserAction(formData);
    setIsEdit(false);
  };

  const previewAvatar = (e: React.FormEvent<HTMLInputElement>): void => {
    const $el = e.currentTarget;
    const { files } = $el;
    if (!files) return;

    const avatarData = files[0];
    if (!avatarData) return;
    const url = URL.createObjectURL(avatarData);
    setUserInfo(Object.assign({}, userInfo, { avatar: url }));
  };

  // 更新页面中的用户信息
  const updateInputVal = (e: React.FormEvent<HTMLInputElement>): void => {
    const $el = e.currentTarget;
    const { name, value } = $el;
    if (name === "sign" && value.length > 30) return;
    setUserInfo(Object.assign({}, userInfo, { [name]: value }));
  };

  const updateInputWidthMaxTotal = (
    total: number,
    payload: { name: string; value: string },
  ): void => {
    const { name, value } = payload;
    if (value.length > total) return;
    setUserInfo(Object.assign({}, userInfo, { [name]: value }));
  };

  /* effect */
  useEffect(() => {
    // ========= 登录profile页面 获取一次userInfo ======== //
    getUserInfo()
      .then((res) => {
        dispatch(setUserAction(res.data));
      })
      .catch((err) => console.error(err));
  }, [dispatch]);
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
        <form
          className="profile-form"
          name="profile"
          ref={$form}
          encType="multipart/form-data"
          method="post"
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
              <img src={userInfo.avatar || DEFAULT_AVATAR} alt="avatar" />
            </Item>
            <Item>
              <Input
                className="profile-form-btn profile-form-edit"
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
            <Item className="profile-form-item" label="姓名" colon={false}>
              <Input
                disabled={!isEdit}
                type="text"
                name="nickname"
                value={userInfo.nickname}
                onInput={(e): void =>
                  updateInputWidthMaxTotal(15, {
                    name: e.currentTarget.name,
                    value: e.currentTarget.value,
                  })
                }
                suffix={<span className="text-count">{userInfo.nickname.length}/15</span>}
              />
            </Item>
            <Row className="profile-hoz profile-form-item" gutter={22}>
              <Col span={12}>
                <Item label="性别" colon={false}>
                  <Select
                    dropdownClassName="profile-form-sex"
                    disabled={!isEdit}
                    value={userInfo.sex}
                    onChange={(value: number): void =>
                      setUserInfo(Object.assign({}, userInfo, { sex: value }))
                    }
                  >
                    <Option value={0}>保密</Option>
                    <Option value={1}>男</Option>
                    <Option value={2}>女</Option>
                  </Select>
                  <Input
                    style={{ display: "none" }}
                    type="text"
                    name="sex"
                    value={userInfo.sex}
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
                      if (date && date.isBetween("1900-01-01", dayjs() as Moment)) return false;
                      return true;
                    }}
                    value={userInfo.birthday ? (dayjs(userInfo.birthday) as Moment) : undefined}
                    onChange={(_date, dateString: string): void => {
                      setUserInfo(
                        Object.assign({}, userInfo, {
                          birthday: dateString,
                        }),
                      );
                    }}
                  ></DatePicker>
                  <Input
                    style={{ display: "none" }}
                    type="string"
                    name="birthday"
                    value={userInfo.birthday}
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
                value={userInfo.sign}
                onInput={(e): void =>
                  updateInputWidthMaxTotal(20, {
                    name: e.currentTarget.name,
                    value: e.currentTarget.value,
                  })
                }
                suffix={<span className="text-count">{userInfo.sign.length}/20</span>}
              />
            </Item>
            <Item className="profile-form-item" label="通讯地址" colon={false}>
              <Input
                placeholder="未填写"
                disabled={!isEdit}
                type="text"
                name="address"
                value={userInfo.address}
                onInput={(e): void =>
                  updateInputWidthMaxTotal(20, {
                    name: e.currentTarget.name,
                    value: e.currentTarget.value,
                  })
                }
                suffix={<span className="text-count">{userInfo.address.length}/20</span>}
              />
            </Item>
            <Item className="profile-form-item" label="就职单位" colon={false}>
              <Input
                placeholder="未填写"
                disabled={!isEdit}
                type="text"
                name="unit"
                value={userInfo.unit}
                onInput={(e): void =>
                  updateInputWidthMaxTotal(20, {
                    name: e.currentTarget.name,
                    value: e.currentTarget.value,
                  })
                }
                suffix={<span className="text-count">{userInfo.unit.length}/20</span>}
              />
            </Item>
            <Item className="profile-form-item" label="手机" colon={false}>
              <Input
                disabled={true}
                type="number"
                name="cell_phone"
                value={userInfo.cell_phone}
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
        </form>
      </div>
    </section>
  );
};

const mapStateToProps = (state: StoreStateI): MapStateToPropsI => ({
  user: state.account,
});
const mapDispatchToProps: MapDispatchToPropsI = {
  updateUserAction,
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
