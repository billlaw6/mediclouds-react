import React, { FunctionComponent } from "react";
import { DEFAULT_SERIES } from "_constants/index";
import { getSexName, isIE } from "_helper";

import { PatientInfoPropsI } from "./type";
import "./style.less";
import { PartitionOutlined } from "@ant-design/icons";

const PatientInfo: FunctionComponent<PatientInfoPropsI> = (props) => {
  const {
    patientInfo,
    currentSeries = DEFAULT_SERIES,
    show = false,
    seriesIndex = 1,
    imageIndex = 1,
    imageIndexMax = 1,
  } = props;

  const {
    patient_name,
    patient_id,
    birthday,
    sex,
    study_date,
    institution_name,
    modality,
  } = patientInfo;

  const { window_center: windowCenter, window_width: windowWidth } = currentSeries;

  return (
    <div className={`player-info ${show ? "" : isIE() ? "hidden" : "filter-blur"}`}>
      <div className="player-info-row">
        <span title="姓名">{patient_name || "匿名"}</span>
        <span title="编号">{patient_id || "NA"}</span>
        <span>
          <span title="生日">{birthday || "NA"}</span>
          <span title="性别">{sex || "保密"}</span>
        </span>
      </div>
      <div className="player-info-row">
        <span title="医院">{institution_name || "NA"}</span>
        <span title="日期">{study_date || "NA"}</span>
      </div>
      <div className="player-info-row">
        <span title="图片索引">
          Frame: {imageIndex} / {imageIndexMax}
        </span>
        <span title="序列">Series: {seriesIndex || "NA"}</span>
        <span>
          <span title="窗宽">WW: {windowWidth || "NA"}</span>
          <span title="窗位">WL: {windowCenter || "NA"}</span>
        </span>
      </div>
      <div className="player-info-row">
        <span title="类型">{modality}</span>
      </div>
    </div>
  );
};

export default PatientInfo;
