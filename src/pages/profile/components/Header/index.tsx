import { ArrowLeftOutlined } from "@ant-design/icons";
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";

const Header: FunctionComponent = () => {
  return (
    <div className="profile-header">
      <h1>个人中心</h1>
      <Link className="profile-back" to="/resources">
        <ArrowLeftOutlined className="iconfont"></ArrowLeftOutlined>
        <span>返回</span>
      </Link>
    </div>
  );
};

export default Header;
