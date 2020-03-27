import React, { FunctionComponent } from "react";

import "./FullscreenLayout.less";

const FullscreenLayout: FunctionComponent = (props) => (
  <div id="fullscreenLayout">{props.children}</div>
);

export default FullscreenLayout;
