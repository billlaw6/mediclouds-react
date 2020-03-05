import React, { FunctionComponent, ReactElement } from "react";
import { Menu, Layout, Avatar, Dropdown } from "antd";
import { ClickParam } from "antd/lib/menu";

import logo from "_images/logo.png";

import { HeaderPropsI } from "./type";

import "./Header.less";
import { Link } from "react-router-dom";

const { Item: MenuItem, ItemGroup: MenuItemGroup, Divider } = Menu;
const { Header: AntdHeader } = Layout;

const getAvatarMenu: FunctionComponent<HeaderPropsI> = (props): ReactElement => {
  const { nickname, cellPhone, logout } = props;

  const onClick = (e: ClickParam): void => {
    const { key } = e;
    if (key === "logout" && logout) logout();
  };

  return (
    <Menu className="header-avatar-menu" onClick={onClick}>
      <MenuItemGroup>
        <ul className="user">
          <li className="user-name">{nickname || "匿名"}</li>
          <li className="user-cell-phone">{cellPhone || "未填写"}</li>
        </ul>
      </MenuItemGroup>
      <Divider></Divider>
      <MenuItemGroup>
        <MenuItem className="edit-user-info" key="editUserInfo">
          <Link to="/profile">个人信息编辑</Link>
        </MenuItem>
        <MenuItem className="logout" key="logout">
          退出
        </MenuItem>
      </MenuItemGroup>
    </Menu>
  );
};

const Header: FunctionComponent<HeaderPropsI> = (props): ReactElement => {
  const { avatar } = props;

  return (
    <AntdHeader id="header">
      <div className="header-content">
        <a className="logo" href="/">
          <img src={logo}></img>
        </a>
        <Dropdown
          className="avatar"
          overlay={getAvatarMenu(props)}
          overlayClassName="avatar-dropdown"
          placement="bottomRight"
        >
          {avatar ? (
            <Avatar size="default" src={avatar}></Avatar>
          ) : (
            <Avatar size="default" icon="user"></Avatar>
          )}
        </Dropdown>
      </div>
    </AntdHeader>
  );
};

export default Header;
