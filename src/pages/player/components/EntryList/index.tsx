/* 
  === 功能入口 ===
  
  当值为 undefined 时，不显示此功能入口
  当值为 false 时，显示入口，但禁用
  当值为 true 时，显示入口，并启用

*/

import React, { FunctionComponent } from "react";
import { isUndefined } from "util";

interface EntryListPropsI {
  showInfo?: boolean; // 显示隐藏信息
  edit?: boolean; // 图像编辑器
  windowAdjust?: boolean; // 调窗
  axis?: boolean; // 长轴重建
  d3?: boolean; // 三维重建
  mpr?: boolean; // mpr
  fullscreen?: boolean; // 全屏
  onShowInfo?: Function; // 当点击显示隐藏信息入口时
}

const EntryList: FunctionComponent<EntryListPropsI> = (props) => {
  const { showInfo, onShowInfo, edit, windowAdjust, axis, mpr, d3, fullscreen } = props;

  // 显示隐藏信息
  if (isUndefined(showInfo)) return <div className="player-entry-list"></div>;
  return null;
};

export default EntryList;
