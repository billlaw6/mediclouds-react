import React, { FunctionComponent } from "react";
import LungNoduleReport from "_components/LungNoduleReport";

import "./style.less";

interface LungNodulesPropsI {
  id: string; // 报告id
}

const LungNodules: FunctionComponent<LungNodulesPropsI> = (props) => {
  const { id } = props;

  return <LungNoduleReport></LungNoduleReport>;
};

export default LungNodules;
