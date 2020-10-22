import { Button, Descriptions, Empty, Modal } from "antd";
import { min } from "moment";
import React, { FunctionComponent, ReactNode } from "react";
import { generateLungNodule } from "_api/ai";
import { formatDate } from "_helper";
import { LungNoduleI, LungNoduleReportI } from "_types/ai";

interface LungNoduleReportPropsI {
  data?: LungNoduleReportI;
}

type LongAxisT = "min" | "mid" | "max"; // min: 小于6mm mid: 6-8mm max: 大于8mm

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

  /**
   * 对结节大小分类
   *
   * @param {LungNoduleI} data 结节
   * @param {Map<LongAxisT, LungNoduleI[]>} list 分类结节列表
   * @returns {Map<LongAxisT, LungNoduleI[]>}
   */
  const filterLongAxis = (
    data: LungNoduleI,
    list: Map<LongAxisT, LungNoduleI[]>,
  ): Map<LongAxisT, LungNoduleI[]> => {
    const { long_axis } = data;
    const cacheList = new Map(list);

    if (long_axis < 6) {
      const minList = list.get("min") || [];
      const nextMinList: LungNoduleI[] = [...minList, data];
      cacheList.set("min", nextMinList);
    } else if (long_axis <= 8 && long_axis >= 6) {
      const midList = list.get("mid") || [];
      const nextMidList: LungNoduleI[] = [...midList, data];
      cacheList.set("min", nextMidList);
    } else {
      const maxList = list.get("max") || [];
      const nextMaxList: LungNoduleI[] = [...maxList, data];
      cacheList.set("min", nextMaxList);
    }

    return cacheList;
  };

  const getNodulesDetailNode = (data: Map<LongAxisT, LungNoduleI[]>, type: "max" | "min") => {
    const detailTitle = type === "max" ? "真实结节概率 0.7 ～ 1.0" : "真实结节概率小于 0.7";
    const min = data.get("min"),
      mid = data.get("mid"),
      max = data.get("max");

    const nodule = (item: LungNoduleI): ReactNode => {
      const { id, origin_img_url, image_details } = item;

      return (
        <article key={id} className="report-full-detail-item">
          <div
            className="report-full-detail-item-cover"
            style={{
              backgroundImage: `url(${origin_img_url})`,
            }}
          ></div>
          <div className="report-full-detail-item-info">
            <div className="report-full-detail-item-preview">
              <span>结节三轴预览</span>
              <div className="report-full-detail-item-preview-imgs">
                <img src={image_details.x_image_tag}></img>
                <img src={image_details.y_image_tag}></img>
                <img src={image_details.z_image_tag}></img>
              </div>
            </div>
            <div className="report-full-detail-item-report"></div>
          </div>
        </article>
      );
    };

    return (
      <div className="report-full-wrapper">
        {min && min.length ? (
          <div className="report-full-detail">
            {min.map((item) => {
              return nodule(item);
            })}
          </div>
        ) : null}
        {mid && mid.length ? (
          <div className="report-full-detail">
            {mid.map((item) => {
              return nodule(item);
            })}
          </div>
        ) : null}
        {max && max.length ? (
          <div className="report-full-detail">
            {max.map((item) => {
              return nodule(item);
            })}
          </div>
        ) : null}
      </div>
    );
  };

  const getNodulesDetail = (data: LungNoduleI[]) => {
    if (!data || !data.length) return null;

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
  };

  const { nodule_details = [], desc, patient_name, sex, study_date, exam_id } = data;

  return (
    <section className="report">
      <header className="report-overview">
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
      </header>
      {nodule_details ? (
        <div className="report-full">{getNodulesDetail(nodule_details)}</div>
      ) : (
        <Button onClick={() => onGetFull(exam_id)}>获取完整版报告</Button>
      )}
    </section>
  );
};

export default LungNoduleReport;
