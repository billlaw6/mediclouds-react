import React, { FunctionComponent, ReactElement } from "react";
import { Menu, Layout, Avatar, Dropdown } from "antd";

import logo from "_images/logo.png";

import { HeaderPropsI } from "./type";

import "./Header.less";
import { Link } from "react-router-dom";

const { Item: MenuItem, ItemGroup: MenuItemGroup, Divider } = Menu;
const { Header: AntdHeader } = Layout;

const AvatarMenu: FunctionComponent<HeaderPropsI> = (props): ReactElement => {
  const { nickname, logout, isSuperuser } = props;

  // const onClick = (e: { key: any }): void => {
  //   const { key } = e;
  //   if (key === "logout" && logout) logout();
  // };

  return (
    <Menu
      className="header-avatar-menu"
      onClick={(info): void => {
        const { key } = info;
        if (key === "logout" && logout) logout();
      }}
    >
      <MenuItemGroup title={nickname || "匿名"}>
        <Divider></Divider>
        <MenuItem className="edit-user-info" key="editUserInfo">
          <Link to="/profile">个人信息</Link>
        </MenuItem>
        <MenuItem className="user-feedback" key="feedback">
          <Link to="/feedback">意见反馈</Link>
        </MenuItem>
        {isSuperuser ? (
          <MenuItem className="dashboard" key="dashboard">
            <Link to="/dashboard">管理看板</Link>
          </MenuItem>
        ) : (
          <div></div>
        )}
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
          overlay={() => <AvatarMenu {...props}></AvatarMenu>}
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
