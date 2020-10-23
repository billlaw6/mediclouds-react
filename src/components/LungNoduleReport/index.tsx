import { Button, Col, Descriptions, Empty, Image, Modal, Row } from "antd";
import React, { FunctionComponent } from "react";
import { generateLungNodule } from "_api/ai";
import { formatDate } from "_helper";
import { LungNoduleI, LungNoduleReportI } from "_types/ai";
import imgFail from "_images/img-fail.png";

import Nodule from "./Nodule";
import { filterLongAxis, LongAxisT } from "./helper";

import "./style.less";

interface LungNoduleReportPropsI {
  data?: LungNoduleReportI;
}

const LungNoduleReport: FunctionComponent<LungNoduleReportPropsI> = (props) => {
  const { data } = props;

  if (!data) return <Empty></Empty>;

  /* 获取完整版 */
  const onGetFull = (id: string): void => {
    Modal.confirm({
      title: "确认获取完整版报告",
      content: "是否消费2000积分获取完整报告？",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        generateLungNodule(id, "full")
          .then((res) => console.log(res))
          .catch((err) => console.error(err));
      },
    });
  };

  const getNodulesDetailNode = (data: Map<LongAxisT, LungNoduleI[]>, type: "max" | "min") => {
    const detailTitle = type === "max" ? "真实结节概率 0.7 ～ 1.0" : "真实结节概率小于 0.7";
    const min = data.get("min"),
      mid = data.get("mid"),
      max = data.get("max");

    // 如果 min&mid&max 都没有
    if ((!min || !min.length) && (!max || !max.length) && (!mid || !mid.length))
      return (
        <div className="report-full-wrapper">
          <span>没有{detailTitle}的结节</span>
        </div>
      );

    let count = 0;

    return (
      <section className="report-full-wrapper">
        <h1 className="report-full-wrapper-title">{detailTitle}</h1>
        {min && min.length ? (
          <div className="report-full-detail">
            {min.map((item) => {
              count++;
              return <Nodule data={item} index={count} key={item.id}></Nodule>;
            })}
          </div>
        ) : null}
        {mid && mid.length ? (
          <div className="report-full-detail">
            {mid.map((item) => {
              count++;
              return <Nodule data={item} index={count} key={item.id}></Nodule>;
            })}
          </div>
        ) : null}
        {max && max.length ? (
          <div className="report-full-detail">
            {max.map((item) => {
              count++;
              return <Nodule data={item} index={count} key={item.id}></Nodule>;
            })}
          </div>
        ) : null}
      </section>
    );
  };

  const getNodulesDetail = (data: LungNoduleI[]) => {
    if (!data || !data.length) return null;

    console.log("data", data);

    /* 过滤没有长轴的 */
    const _data = data.filter((item) => item.long_axis);

    /* 按实性分类 */
    let realMax: Map<LongAxisT, LungNoduleI[]> = new Map(); // 概率 0.7 - 1.0
    let realMin: Map<LongAxisT, LungNoduleI[]> = new Map(); // 概率小于 .7

    _data.forEach((item) => {
      const { score } = item;
      if (score >= 0.7) {
        realMax = filterLongAxis(item, realMax);
      } else {
        realMin = filterLongAxis(item, realMin);
      }
    });

    return (
      <>
        {getNodulesDetailNode(realMax, "max")}
        {getNodulesDetailNode(realMin, "min")}
      </>
    );
  };

  const { thumbnail, nodule_details = [], desc, patient_name, sex, study_date, exam_id } = data;

  return (
    <section className="report">
      <header className="report-overview">
        <Row gutter={24}>
          <Col span={8}>
            <Image src={thumbnail || imgFail}></Image>
          </Col>
          <Col span={24 - 8}>
            <Descriptions>
              <Descriptions.Item key="patientName" label="姓名">
                {patient_name}
              </Descriptions.Item>
              <Descriptions.Item key="sex" label="性别">
                {sex}
              </Descriptions.Item>
              <Descriptions.Item key="sutdyDate" label="检查日期">
                {formatDate(study_date)}
              </Descriptions.Item>
              <Descriptions.Item key="desc" label="描述">
                {desc || "没有描述"}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </header>
      {nodule_details ? (
        <div className="report-full">{getNodulesDetail(nodule_details)}</div>
      ) : (
        <Button onClick={(): void => onGetFull(exam_id)}>获取完整版报告</Button>
      )}
    </section>
  );
};

export default LungNoduleReport;
