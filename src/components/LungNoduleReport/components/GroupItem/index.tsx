import React, { FunctionComponent } from "react";
import { Collapse } from "antd";
import { LungNoduleI } from "mc-api";

import { NoduleItemsI } from "./../../types";
import VariableCard from "../VariableCard";
import Header from "./header";

import "./style.less";

interface TypeGroupPropsI {
  data?: NoduleItemsI;
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
      <Panel
        collapsible="header"
        key="0"
        header={<Header title="大于8mm的结节" count={data.max.length}></Header>}
      >
        <VariableCard data={data.max} examId={examId} seriesId={seriesId}></VariableCard>
      </Panel>
      <Panel
        collapsible="header"
        key="1"
        header={<Header title="6～8mm的结节" count={data.mid.length}></Header>}
      >
        <VariableCard data={data.mid} examId={examId} seriesId={seriesId}></VariableCard>
      </Panel>
      <Panel
        collapsible="header"
        key="2"
        header={<Header title="小于6mm的结节" count={data.min.length}></Header>}
      >
        <VariableCard data={data.min} examId={examId} seriesId={seriesId}></VariableCard>
      </Panel>
    </Collapse>
  );
};

export default GroupItem;
