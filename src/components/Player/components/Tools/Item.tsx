import React, { FunctionComponent } from "react";
import { Tooltip } from "antd";

interface ToolsItemPropsI {
  title: string;
}

const ToolsItem: FunctionComponent<ToolsItemPropsI> = (props) => {
  const { title, children } = props;

  return (
    <Tooltip title={title} overlayStyle={{ fontSize: "1rem" }}>
      {children}
    </Tooltip>
  );
};

export default ToolsItem;
