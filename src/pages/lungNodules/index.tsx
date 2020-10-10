import { PageHeader } from "antd";
import React, { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";

import "./style.less";

const LungNodules: FunctionComponent = () => {
  const history = useHistory();

  return (
    <div className="lung-nodules">
      <PageHeader
        title="肺结节筛查"
        subTitle="上传DICOM影像，分析肺结节"
        onBack={(): void => history.goBack()}
      ></PageHeader>
    </div>
  );
};

export default LungNodules;
