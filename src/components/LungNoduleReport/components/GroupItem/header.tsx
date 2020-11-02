import { Badge } from "antd";
import React, { FunctionComponent } from "react";

interface HeaderPropsI {
  count: number; // 计数
  title: string;
}

const Header: FunctionComponent<HeaderPropsI> = (props) => {
  const { count, title } = props;

  return (
    <div className="report-group-item-title">
      <span>{title}</span>
      <Badge
        count={count}
        overflowCount={99}
        showZero
        style={{
          backgroundColor: count ? "red" : "gray",
        }}
      ></Badge>
    </div>
  );
};

export default Header;
