import { Badge, Button, Col, Descriptions, Empty, Image, Modal, Row, Tabs } from "antd";
import React, { FunctionComponent, useState } from "react";
import { formatDate } from "_helper";
import imgFail from "_images/img-fail.png";
import { filterNodulesTruth, getCountWithNoduleType, getRenderData } from "./helper";
import VariableCard from "./components/VariableCard";

import Desc from "./components/Desc";
import GroupItem from "./components/GroupItem";
import useReport from "_hooks/useReport";

import "./style.less";

const { TabPane } = Tabs;

const LungNoduleReport: FunctionComponent = () => {
  const { lungNodule: data, generateFullLungNodule } = useReport();

  const [pending, setPending] = useState(false);

  if (!data) return <Empty></Empty>;

  /* 选出real和fake 的结节 */
  const { real: realNodules, fake: fakeNodules } = filterNodulesTruth(data.nodule_details || []);

  /* 获取完整版 */
  const onGetFull = (id: string): void => {
    Modal.confirm({
      title: "确认获取完整版报告",
      content: "是否消费2000积分获取完整报告？",
      okText: "确定",
      cancelText: "取消",
      centered: true,
      onOk: () => {
        setPending(true);
        generateFullLungNodule(id)
          .then((res) => {
            // console.log(res);
          })
          .catch((err) => console.error(err))
          .finally(() => setPending(false));
      },
    });
  };

  const { thumbnail, desc, patient_name, sex, study_date, exam_id, series_id, flag } = data;

  const renderData = getRenderData(realNodules);
  const noduleTypeCount = getCountWithNoduleType(realNodules);

  return (
    <section className="report">
      <header className="report-overview">
        <Row className="report-overview-item" gutter={24}>
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
                <Desc details={flag < 1} tab extra>
                  {desc}
                </Desc>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Row className="report-overview-item">
          <Col
            span={24}
            style={{
              color: "#c1c1c1",
              fontSize: "14px",
            }}
          >
            （该报告仅是对影像进行的技术分析，不作为诊断及医疗依据）
          </Col>
        </Row>
      </header>
      {flag < 1 ? (
        <Button type="primary" block loading={pending} onClick={(): void => onGetFull(exam_id)}>
          获取完整版
        </Button>
      ) : (
        <div className="report-full">
          <Tabs defaultActiveKey="0">
            <TabPane
              key="0"
              tab={
                <Badge size="small" count={noduleTypeCount.solid || 0} offset={[6, -4]}>
                  实性
                </Badge>
              }
            >
              <GroupItem
                key="0"
                data={renderData ? renderData.solid : undefined}
                // type="实性"
                seriesId={series_id}
                examId={exam_id}
              ></GroupItem>
            </TabPane>
            <TabPane
              tab={
                <Badge size="small" count={noduleTypeCount.subSolid || 0} offset={[6, -4]}>
                  亚实性
                </Badge>
              }
              key="1"
            >
              <GroupItem
                key="1"
                data={renderData ? renderData.subSolid : undefined}
                // type="亚实性"
                seriesId={series_id}
                examId={exam_id}
              ></GroupItem>
            </TabPane>
            <TabPane
              tab={
                <Badge size="small" count={noduleTypeCount.groundGlass || 0} offset={[6, -4]}>
                  磨玻璃
                </Badge>
              }
              key="2"
            >
              <GroupItem
                key="2"
                data={renderData ? renderData.groundGlass : undefined}
                // type="磨玻璃"
                seriesId={series_id}
                examId={exam_id}
              ></GroupItem>
            </TabPane>
            <TabPane
              tab={
                <Badge size="small" count={fakeNodules.length || 0} offset={[6, -4]}>
                  疑似结节
                </Badge>
              }
              key="3"
            >
              <VariableCard data={fakeNodules} examId={exam_id} seriesId={series_id}></VariableCard>
            </TabPane>
          </Tabs>
        </div>
      )}
    </section>
  );
};

export default LungNoduleReport;
