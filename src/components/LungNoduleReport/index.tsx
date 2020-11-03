import { Button, Col, Descriptions, Empty, Image, Modal, Row, Tabs } from "antd";
import React, { FunctionComponent } from "react";
import { generateLungNodule } from "_api/ai";
import { formatDate, parseLungNoduleDesc } from "_helper";
import { LungNoduleI, LungNoduleReportI } from "_types/ai";
import imgFail from "_images/img-fail.png";
import { filterNoduleProbable, filterNoduleSize, filterNoduleType } from "./helper";
import { NodulesGroupI, NodulesGroupItemI, RenderDataI } from "./types";

import Group from "./components/Group";
import Desc from "./components/Desc";

import "./style.less";

const { TabPane } = Tabs;

interface LungNoduleReportPropsI {
  data?: LungNoduleReportI;
}

const LungNoduleReport: FunctionComponent<LungNoduleReportPropsI> = (props) => {
  // const history = useHistory();
  const { data } = props;

  if (!data) return <Empty></Empty>;

  // const goPlayer = (index: number): void => {
  //   const { nodule_details } = data;

  //   if (!nodule_details) return;
  //   const { exam_id, series_id } = data;

  //   history.push(`/player/?exam=${exam_id}&series=${series_id}&index=${index}`);
  // };

  // /* 获取完整版 */
  // const onGetFull = (id: string): void => {
  //   Modal.confirm({
  //     title: "确认获取完整版报告",
  //     content: "是否消费2000积分获取完整报告？",
  //     okText: "确定",
  //     cancelText: "取消",
  //     onOk: () => {
  //       generateLungNodule(id, "full")
  //         .then((res) => console.log(res))
  //         .catch((err) => console.error(err));
  //     },
  //   });
  // };

  /**
   * 获取渲染Data
   * @param data
   */
  const getRenderData = (data?: LungNoduleI[]): RenderDataI | undefined => {
    if (!data) return;

    /* 过滤没有长轴的 */
    const _data = data.filter((item) => item.long_axis);

    const renderData: RenderDataI = {};

    /* 依结节性质分类 */
    const typeRes = filterNoduleType(_data);
    for (const typeKey of Object.keys(typeRes)) {
      const data = typeRes[typeKey] || [];

      /* 依结节真实性分类 */
      const realRes = filterNoduleProbable(data);
      const group: NodulesGroupI = {};

      for (const realKey of Object.keys(realRes)) {
        const data = realRes[realKey] || [];

        /* 依结节长轴尺寸分类 */
        const sizeRes = filterNoduleSize(data);
        const groupItem: NodulesGroupItemI = sizeRes;
        group[realKey] = groupItem;
      }

      renderData[typeKey] = group;
    }

    console.log("render Data", renderData);

    return renderData;
  };

  const {
    thumbnail,
    nodule_details = [],
    desc,
    patient_name,
    sex,
    study_date,
    exam_id,
    series_id,
  } = data;

  const renderData = getRenderData(nodule_details);

  console.log("rednerData", renderData);

  return (
    <section className="report">
      <header className="report-overview">
        <Row gutter={24}>
          <Col span={8}>
            <Image src={thumbnail || imgFail}></Image>
          </Col>
          <Col span={24 - 8}>
            <Descriptions column={1}>
              <Descriptions.Item key="patientName" label="姓名">
                {patient_name}
              </Descriptions.Item>
              <Descriptions.Item key="sex" label="性别">
                {sex}
              </Descriptions.Item>
              <Descriptions.Item key="sutdyDate" label="检查日期">
                {formatDate(study_date)}
              </Descriptions.Item>
              <Descriptions.Item key="desc" label="分析结果">
                <Desc>{desc}</Desc>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </header>
      <div className="report-full">
        <Tabs defaultActiveKey="0">
          <TabPane key="0" tab="实性">
            <Group
              key="0"
              data={renderData ? renderData.solid : undefined}
              type="实性"
              seriesId={series_id}
              examId={exam_id}
            ></Group>
          </TabPane>
          <TabPane tab="亚实性" key="1">
            <Group
              key="1"
              data={renderData ? renderData.subSolid : undefined}
              type="亚实性"
              seriesId={series_id}
              examId={exam_id}
            ></Group>
          </TabPane>
          <TabPane tab="磨玻璃" key="2">
            <Group
              key="2"
              data={renderData ? renderData.groundGlass : undefined}
              type="磨玻璃"
              seriesId={series_id}
              examId={exam_id}
            ></Group>
          </TabPane>
        </Tabs>
      </div>
    </section>
  );
};

export default LungNoduleReport;
