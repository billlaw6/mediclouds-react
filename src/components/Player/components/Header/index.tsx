import { ArrowLeftOutlined } from "@ant-design/icons";
import React, { FunctionComponent } from "react";
import { useHistory } from "react-router";

import "./style.less";

interface HeaderPropsI {
  backTo?: string;
}

const Header: FunctionComponent<HeaderPropsI> = (props) => {
  const { backTo } = props;
  const history = useHistory();

  return (
    <header className="header">
      <h2 className="title">
        医影浏览器
        <sub>版本: v1.0</sub>
      </h2>
      <ArrowLeftOutlined
        className="back"
        onClick={(): void => {
          backTo && history.push(backTo);
        }}
      ></ArrowLeftOutlined>
    </header>
  );
};

export default Header;
