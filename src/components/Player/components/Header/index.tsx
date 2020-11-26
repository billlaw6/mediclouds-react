import { ArrowLeftOutlined } from "@ant-design/icons";
import React, { FunctionComponent } from "react";

import "./style.less";

const Header: FunctionComponent = () => {
  return (
    <header className="header">
      <h2 className="title">
        mediclouds dicom player
        <sub>version: 1.0</sub>
      </h2>
      <ArrowLeftOutlined className="back"></ArrowLeftOutlined>
    </header>
  );
};

export default Header;
