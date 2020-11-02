import React, { FunctionComponent } from "react";
import { LungNoduleI } from "_types/ai";

import { NodulesGroupItemI } from "./../../types";
import VariableCard from "../VariableCard";
import { Collapse } from "antd";

import "./style.less";
import Header from "./header";

interface TypeGroupPropsI {
  data?: NodulesGroupItemI;
  examId: string;
  seriesId: string;
}

const { Panel } = Collapse;

const GroupItem: FunctionComponent<TypeGroupPropsI> = (props) => {
  const { data, examId, seriesId } = props;
  let defaultIndex = 0;

  if (data) {
    const keys = Object.keys(data) || [];

    for (let i = 0; i < keys.length; i++) {
      const val = data[keys[i]] as LungNoduleI[];
      if (val.length) {
        defaultIndex = i;
        break;
      }
    }
  }

  if (!data) return null;

  return (
    <Collapse accordion defaultActiveKey={[`${defaultIndex}`]}>
      <Panel key="0" header={<Header title="大于8mm的结节" count={data.max.length}></Header>}>
        <VariableCard data={data.max} examId={examId} seriesId={seriesId}></VariableCard>
      </Panel>
      <Panel key="1" header={<Header title="6～8mm的结节" count={data.mid.length}></Header>}>
        <VariableCard data={data.mid} examId={examId} seriesId={seriesId}></VariableCard>
      </Panel>
      <Panel key="2" header={<Header title="小于6mm的结节" count={data.min.length}></Header>}>
        <VariableCard data={data.min} examId={examId} seriesId={seriesId}></VariableCard>
      </Panel>
    </Collapse>
  );
};

export default GroupItem;
