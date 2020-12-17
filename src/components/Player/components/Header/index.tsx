import { ArrowLeftOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import React, { FunctionComponent } from "react";
import { useHistory } from "react-router";
import useSettings from "_components/Player/hooks/useSettings";

import "./style.less";

interface HeaderPropsI {
  backTo?: string;
}

const Header: FunctionComponent<HeaderPropsI> = (props) => {
  const { backTo } = props;
  const history = useHistory();
  const { switchPlayerVersion } = useSettings();

  return (
    <header className="header">
      <h2 className="title">
        医影浏览器
        <sub>版本: v0.1 alpha</sub>
      </h2>
      <div className="buttons">
        <Tag
          className="back-old-version"
          color="volcano"
          onClick={(): void => switchPlayerVersion(false)}
        >
          返回旧版播放器
        </Tag>
        <ArrowLeftOutlined
          className="back"
          onClick={(): void => {
            backTo && history.push(backTo);
          }}
        ></ArrowLeftOutlined>
      </div>
    </header>
  );
};

export default Header;
