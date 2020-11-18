import { Badge, Button, Col, Descriptions, Empty, Image, Modal, Result, Row, Tabs } from "antd";
import React, { FunctionComponent, useEffect, useState } from "react";
import { formatDate } from "_helper";
import imgFail from "_images/img-fail.png";
import useAccount from "_hooks/useAccount";
import useReport from "_hooks/useReport";
import { FULL_LUNG_NODULES_REPORT, GET_SCORE } from "_constants/index";
import GeneratorQrcode from "qrcode.react";

import { filterNodulesTruth, getCountWithNoduleType, getRenderData } from "./helper";
import VariableCard from "./components/VariableCard";
import Desc from "./components/Desc";
import GroupItem from "./components/GroupItem";

import "./style.less";
import useOrder from "_hooks/useOrder";
import useProd from "_hooks/useProd";
import { getOrderWechatPayQrcode } from "_api/pay";
import { getProducts } from "_api/product";

const { TabPane } = Tabs;

const LungNoduleReport: FunctionComponent = () => {
  const { account } = useAccount();
  const { lungNodule: data, generateFullLungNodule } = useReport();
  const { generateLungNoduleFullReportOrder } = useOrder();

  const [pending, setPending] = useState(false);
  const [showImg, setShowImg] = useState(false); // 显示完整版示意图
  const [err, setErr] = useState(false); // 显示错误信息
  const [payQrcode, setPayQrcode] = useState(""); // 购买完整版二维码

  if (!data) return <Empty></Empty>;

  /* 选出real和fake 的结节 */
  const { real: realNodules, fake: fakeNodules } = filterNodulesTruth(data.nodule_details || []);

  /* 获取完整版 */
  const onGetFull = (id: string): void => {
    Modal.confirm({
      title: "获取完整版报告",
      content: (
        <span>
          <b style={{ color: "red" }}>限时优惠</b>：仅需<b style={{ color: "red" }}>3000</b>
          积分即可获得完整版报告
        </span>
      ),
      okText: "确定",
      cancelText: "取消",
      centered: true,
      onOk: () => {
        if (account.score >= 3000) {
          setPending(true);
          generateFullLungNodule(id)
            .then((res) => {
              // console.log(res);
            })
            .catch((err) => console.error(err))
            .finally(() => setPending(false));
        } else {
          setErr(true);
        }
      },
    });
  };

  /** 获取购买完整版的扫码支付二维码 */
  const buyFullReportQrcode = async (): Promise<string | undefined> => {
    try {
      const prodsRes = await getProducts();
      const prod = prodsRes.find((item) => item.code === "AI_LUNG_02");
      if (!prod) return;

      const orderRes = await generateLungNoduleFullReportOrder(prod.id);
      if (!orderRes) return;

      return await getOrderWechatPayQrcode(orderRes.order_number);
    } catch (error) {
      throw new Error(error);
    }
  };

  const { thumbnail, desc, patient_name, sex, study_date, exam_id, series_id, flag } = data;

  const renderData = getRenderData(realNodules);
  const noduleTypeCount = getCountWithNoduleType(realNodules);

  if (err) {
    return (
      <Result
        status="warning"
        title="积分不足"
        subTitle="请邀请好友赚取积分或充值积分后重试"
        extra={[
          <Button key="go_back" type="ghost" onClick={(): void => setErr(false)}>
            返回
          </Button>,
          // <Button
          //   key="buy"
          //   type="primary"
          //   onClick={(): void => {
          //     buyFullReportQrcode()
          //       .then((res) => res && setPayQrcode(res))
          //       .catch((err) => console.error(err));
          //   }}
          // >
          //   点击扫码购买
          // </Button>,
        ]}
      >
        <div className="report-result">
          {payQrcode ? <GeneratorQrcode value={payQrcode} size={256}></GeneratorQrcode> : null}
          <img src={GET_SCORE} style={{ width: "100%" }}></img>
        </div>
      </Result>
    );
  }

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
        <div className="report-review">
          <Button
            className="report-review-btn"
            type="primary"
            block
            loading={pending}
            onClick={(): void => onGetFull(exam_id)}
          >
            获取完整版
          </Button>
          <a onClick={(): void => setShowImg(!showImg)}>
            {showImg ? "隐藏" : "显示"}完整版AI筛查报告示意图
          </a>
          <img
            style={{ width: "100%", display: showImg ? "inline-block" : "none" }}
            src={FULL_LUNG_NODULES_REPORT}
          ></img>
        </div>
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
                  部分实性
                </Badge>
              }
              key="1"
            >
              <GroupItem
                key="1"
                data={renderData ? renderData.subSolid : undefined}
                // type="部分实性"
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
