import { Col, Descriptions, Row } from "antd";
import React, { FunctionComponent } from "react";
import { getAgeByBirthday } from "_helper";
import { PatientExamI } from "_types/api";
import { ReportI } from "_types/resources";

interface ReportPropsI {
  title: string; // 报告的标题
  subTitle?: string; // 副标题
  data?: ReportI;
}

interface ReportOverviewPropsI {
  url: string; // series缩略图地址
  patientInfo: PatientExamI; // 病人信息
  desc: string; // 说明
}

const ReportOverview: FunctionComponent<ReportOverviewPropsI> = (props) => {
  const { url, patientInfo, desc } = props;
  const { patient_name, sex, birthday, study_date } = patientInfo;

  return (
    <article className="report-overview">
      <Row>
        <Col>
          <div className="report-overview-img" style={{ backgroundImage: `url(${url})` }}></div>
          <Descriptions>
            <Descriptions.Item label="姓名">{patient_name}</Descriptions.Item>
            <Descriptions.Item label="性别">{sex}</Descriptions.Item>
            <Descriptions.Item label="年龄">{getAgeByBirthday(birthday)}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col>
          <h3>对该组影像分析结果如下</h3>
          <p>{}</p>
        </Col>
      </Row>
    </article>
  );
};

const Report: FunctionComponent<ReportPropsI> = (props) => {
  const { title, subTitle, data } = props;

  return (
    <section className="report">
      <header>
        <hgroup>
          <h1>{title}</h1>
          {subTitle ? <h2>{subTitle}</h2> : null}
        </hgroup>
      </header>
      <main id="reportMain" className="report-main">
        <article></article>
      </main>
    </section>
  );
};

export default Report;
