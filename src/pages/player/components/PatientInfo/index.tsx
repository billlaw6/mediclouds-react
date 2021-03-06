import React, { FunctionComponent } from "react";
import { DEFAULT_SERIES } from "_constants";
import { getMaxDimIdx, getTexVal, isIE } from "_helper";
import Scrollbars from "react-custom-scrollbars";

import { PatientInfoPropsI } from "./type";
import "./style.less";

const PatientInfo: FunctionComponent<PatientInfoPropsI> = (props) => {
  const {
    patientInfo,
    currentSeries = DEFAULT_SERIES,
    show = false,
    seriesIndex = 1,
    imageIndex = 1,
    imageIndexMax = 1,
    nodule,
  } = props;

  const getLungNoduleReport = () => {
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
      max_dim_idx,
    } = nodule;

    return (
      <Scrollbars autoHide>
        <article className="player-info-row lung-nodule-report">
          <header className="title">肺结节</header>
          <ul className="content">
            <li>
              体积(mm<sup>3</sup>): {vol}
            </li>
            <li>材质: {getTexVal(tex)}</li>
            <li>
              尺寸(mm x mm): {long_axis} x {short_axis}({getMaxDimIdx(max_dim_idx)})
            </li>
            <li>实性部分长轴(mm): {solid_axis || "-"}</li>
            <li>实性部分比例(%): {Math.round(solid_ratio * 100)}</li>
            <li>钙化比例(%): {Math.round(cal_ratio * 100)}</li>
            <li>磨玻璃比例(%): {Math.round(gg_ratio * 100)}</li>
            <li>最大CT值: {max_hu}</li>
            <li>最小CT值: {min_hu}</li>
            <li>平均CT值: {mean_hu}</li>
            <li>结节位置:{description}</li>
          </ul>
        </article>
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
