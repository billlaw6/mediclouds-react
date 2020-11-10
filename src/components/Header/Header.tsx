import React, { FunctionComponent, ReactElement } from "react";
import { Menu, Layout, Avatar, Dropdown } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

import logo from "_images/logo.png";

import { HeaderPropsI } from "./type";

import "./Header.less";

const { Item: MenuItem, ItemGroup: MenuItemGroup, Divider, SubMenu } = Menu;
const { Header: AntdHeader } = Layout;

// const AvatarMenu: FunctionComponent<HeaderPropsI> = (props): ReactElement => {
//   const { nickname, logout, isSuperuser } = props;

//   // const onClick = (e: { key: any }): void => {
//   //   const { key } = e;
//   //   if (key === "logout" && logout) logout();
//   // };

//   return (
//     <Menu
//       className="header-avatar-menu"
//       onClick={(info): void => {
//         const { key } = info;
//         if (key === "logout" && logout) logout();
//       }}
//     >
//       <MenuItemGroup title={nickname || "匿名"}>
//         <Divider></Divider>
//         <MenuItem className="edit-user-info" key="editUserInfo">
//           <Link to="/profile">个人信息</Link>
//         </MenuItem>
//         <MenuItem className="user-feedback" key="feedback">
//           <Link to="/feedback">意见反馈</Link>
//         </MenuItem>
//         {isSuperuser ? (
//           <MenuItem className="dashboard" key="dashboard">
//             <Link to="/manager">管理后台</Link>
//           </MenuItem>
//         ) : (
//           <div></div>
//         )}
//         <MenuItem className="logout" key="logout">
//           退出
//         </MenuItem>
//       </MenuItemGroup>
//     </Menu>
//   );
// };

const Header: FunctionComponent<HeaderPropsI> = (props): ReactElement => {
  const { avatar, isSuperuser, logout, nickname } = props;

  return (
    <AntdHeader id="header">
      <div className="header-content">
        <a className="logo" href="/">
          <img src={logo}></img>
        </a>
        <Menu
          className="header-menu"
          mode="horizontal"
          onClick={(info): void => {
            const { key } = info;
            if (key === "logout" && logout) logout();
          }}
        >
          {/* <SubMenu popupClassName="header-menu-sub" title="AI功能" key="ai">
            <MenuItem className="header-menu-item" key="lungNodules">
              <Link to="/ai/lung-nodules">肺结节筛查</Link>
            </MenuItem>
          </SubMenu> */}
          <SubMenu
            key="user"
            popupClassName="header-menu-sub"
            title={
              avatar ? (
                <Avatar size="default" src={avatar}></Avatar>
              ) : (
                <Avatar size="default" icon={<UserOutlined />}></Avatar>
              )
            }
          >
            <MenuItem className="header-menu-item user-nickname" key="userName">
              {nickname || "匿名"}
            </MenuItem>
            <Divider />
            <MenuItem className="header-menu-item edit-user-info" key="editUserInfo">
              <Link to="/profile">个人信息</Link>
            </MenuItem>
            <MenuItem className="header-menu-item user-feedback" key="feedback">
              <Link to="/feedback">意见反馈</Link>
            </MenuItem>
            {isSuperuser ? (
              <MenuItem className="header-menu-item dashboard" key="dashboard">
                <Link to="/manager">管理后台</Link>
              </MenuItem>
            ) : null}
            <MenuItem className="header-menu-item logout" key="logout">
              退出
            </MenuItem>
          </SubMenu>
        </Menu>
      </div>
    </AntdHeader>
  );
};

export default Header;
