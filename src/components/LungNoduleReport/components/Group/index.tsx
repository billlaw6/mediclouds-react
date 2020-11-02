import React, { FunctionComponent, useState } from "react";
import { Radio } from "antd";

import { isEmptyGroup } from "../../helper";
import { NodulesGroupI } from "../../types";
import GroupItem from "../GroupItem";

import "./style.less";

interface TypeGroupPropsI {
  key: string; // 此组件的key
  data?: NodulesGroupI;
  type: "实性" | "亚实性" | "磨玻璃";
  examId: string;
  seriesId: string;
}

const TypeGroup: FunctionComponent<TypeGroupPropsI> = (props) => {
  const { data, type, examId, seriesId } = props;
  const [segmentIndex, setSegmentIndex] = useState(0); // 当前分段的索引

  const isEmpty = isEmptyGroup(data);

  return isEmpty ? (
    <span>未发现{type}结节</span>
  ) : (
    <div className="report-group">
      <Radio.Group
        className="report-group-ctl"
        onChange={(e): void => setSegmentIndex(e.target.value)}
        defaultValue={segmentIndex}
      >
        <Radio.Button value={0}>真实结节概率70%以上</Radio.Button>
        <Radio.Button value={1}>真实结节概率70%以下</Radio.Button>
      </Radio.Group>
      <div className="report-group-content">
        {segmentIndex === 0 ? (
          <GroupItem
            examId={examId}
            seriesId={seriesId}
            data={data ? data.max : undefined}
          ></GroupItem>
        ) : null}
        {segmentIndex === 1 ? (
          <GroupItem
            examId={examId}
            seriesId={seriesId}
            data={data ? data.min : undefined}
          ></GroupItem>
        ) : null}
      </div>
    </div>
  );
};

export default TypeGroup;
