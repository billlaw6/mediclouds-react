import React, { FunctionComponent } from "react";
import { DEFAULT_SERIES } from "_constants/index";
import { getTexVal, isIE } from "_helper";

import { PatientInfoPropsI } from "./type";
import "./style.less";
import Scrollbars from "react-custom-scrollbars";

const PatientInfo: FunctionComponent<PatientInfoPropsI> = (props) => {
  const {
    patientInfo,
    currentSeries = DEFAULT_SERIES,
    show = false,
    seriesIndex = 1,
    imageIndex = 1,
    imageIndexMax = 1,
    lungNodulesReport,
  } = props;

  const getLungNoduleReport = () => {
    if (!lungNodulesReport) return null;
    const { nodule_details } = lungNodulesReport;
    if (!nodule_details) return null;

    const nodule = nodule_details.find((item) => item.disp_z === imageIndex - 1);
    if (!nodule) return null;
    const {
      vol,
      tex,
      long_axis,
      short_axis,
      solid_axis,
      solid_ratio,
      cal_ratio,
      gg_ratio,
      max_hu,
      mean_hu,
      min_hu,
      description,
    } = nodule;

    return (
      <Scrollbars autoHide>
        <div className="player-info-row lung-nodule-report">
          <span className="title">肺结节</span>
          <span>体积(mm3): {vol}</span>
          <span>材质: {getTexVal(tex)}</span>
          <span>
            尺寸(mm x mm): {long_axis} x {short_axis}
          </span>
          <span>实行部分长轴(mm): {solid_axis || "-"}</span>
          <span>实行部分比例(%): {Math.round(solid_ratio * 100)}</span>
          <span>钙化比例(%): {Math.round(cal_ratio * 100)}</span>
          <span>磨玻璃比例(%): {Math.round(gg_ratio * 100)}</span>
          <span>最大CT值: {max_hu}</span>
          <span>最小CT值: {min_hu}</span>
          <span>平均CT值: {mean_hu}</span>
          <span>结节位置:{description}</span>
        </div>
      </Scrollbars>
    );
  };

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

      {getLungNoduleReport()}
    </div>
  );
};

export default PatientInfo;
