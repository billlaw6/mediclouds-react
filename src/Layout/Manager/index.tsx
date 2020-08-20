import React, { FunctionComponent } from "react";

const ManagerLayout: FunctionComponent = (props = {}) => {
  return <div id="manangerLayout">{props.children}</div>;
};

export default ManagerLayout;
