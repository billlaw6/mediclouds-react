/**
 * 序列视图模块
 *
 * [功能]
 * 1. 展现序列缩略图
 * 2. 切换当前序列
 *
 */
import React, { FunctionComponent, ReactNode } from "react";

import { PlayerDataI, PlayerDataMapT } from "../../type";
import Item from "./Item";

interface SeriesViewPropsI {
  current: number; // 当前序列的索引
  data?: PlayerDataMapT; // 数据
  onChange?: (index: number) => void; // 当手动点击某个序列时，触发，参数index为被点序列的索引值
}

const SeriesView: FunctionComponent<SeriesViewPropsI> = (props) => {
  const { current, data } = props;
  const getChildren = (): ReactNode[] => {
    const res: ReactNode[] = [];

    if (!data) return res;

    data.forEach((data, index) => {
      res.push(<Item key={`p_s_${data.id}_${index}`}></Item>);
    });

    return res;
  };

  return (
    <section className="series-view">
      series index: {current}
      {getChildren()}
    </section>
  );
};

export default SeriesView;
