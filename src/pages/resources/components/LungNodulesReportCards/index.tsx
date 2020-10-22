import { Badge, Card, Checkbox, Col, Empty, Grid, Row, Modal } from "antd";
import React, { FunctionComponent, ReactNode, useState } from "react";
import { formatDate } from "_helper";
import { LungNoduleReportI } from "_types/ai";
import { GetSearchQueryPropsI, SearchQueryResI } from "_types/api";
import imgFail from "_assets/images/img-fail.png";
import { generateLungNodule } from "_api/ai";

import "./style.less";
import LungNoduleReport from "_components/LungNoduleReport";

const { Meta } = Card;
const { useBreakpoint } = Grid;

interface LungNodulesReportCardsPropsI {
  searchQuery: GetSearchQueryPropsI;
  isSelectable?: boolean; // 是否选择模式
  selected?: string[]; // 已选择的id
  data?: SearchQueryResI<LungNoduleReportI>; // 数据
  onSelected?: (vals: string[]) => void;
  onChangePagination?: (current: number) => void; // 当页码更新时触发
}

const SCREEN_SIZE_LIST = {
  xxl: 4,
  xl: 4,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1,
};

const CardMeta: FunctionComponent<{ data: LungNoduleReportI }> = (props) => {
  const { data } = props;
  const { patient_name, sex, desc, study_date } = data;

  const content = (
    <div>
      姓名: {patient_name}
      <br />
      性别: {sex}
      <br />
      检查日期: {formatDate(study_date)}
      <br />
      影像信息: {desc || "没有信息"}
    </div>
  );

  return <Meta title={`${patient_name} / ${sex}`} description={content}></Meta>;
};

const LungNodulesReportCards: FunctionComponent<LungNodulesReportCardsPropsI> = (props) => {
  const { data, selected, isSelectable, onSelected } = props;
  const screen = useBreakpoint();

  const [current, setCurrent] = useState<LungNoduleReportI>();

  const getColCount = (): number => {
    const { xs, sm, xl, lg } = screen;

    if (xl) return SCREEN_SIZE_LIST.xl;
    if (lg) return SCREEN_SIZE_LIST.md;
    if (sm) return SCREEN_SIZE_LIST.sm;
    if (xs) return SCREEN_SIZE_LIST.xs;

    return SCREEN_SIZE_LIST.xl;
  };

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

  const getContent = (data: LungNoduleReportI[]): ReactNode => {
    const res: ReactNode[] = [];
    let cols: ReactNode[] = [];
    const colcount = getColCount();
    let count = 0;

    data.forEach((item) => {
      if (count >= colcount) {
        res.push(
          <Row gutter={[10, 10]} key={`row_${res.length}`}>
            {cols}
          </Row>,
        );
        cols = [];
        count = 0;
      } else {
        const { id, thumbnail = "", flag, err, exam_id } = item;

        let badgeVals = {
          text: "简版",
          color: "green",
        };

        switch (flag) {
          case 1:
            badgeVals = {
              text: "完整版",
              color: "green",
            };
            break;
          case 2:
            badgeVals = {
              text: "完整版（含三维重建）",
              color: "purple",
            };
            break;
          default:
            break;
        }

        let actions: ReactNode[] = [];
        if (flag === 0)
          actions = [
            <span key="get-full" onClick={(): void => onGetFull(exam_id)}>
              获取完整版
            </span>,
          ];
        if (flag === 1)
          actions = [
            <span key="full" onClick={(): void => setCurrent(item)}>
              查看完整版
            </span>,
          ];
        if (err) actions = [<span key="recreate">重新获取</span>];

        cols.push(
          <Col
            className={`resources-lung-nodules-report-cards-item`}
            span={24 / colcount}
            key={`col_${id}`}
          >
            <label>
              {isSelectable ? (
                <Checkbox
                  className="resources-lung-nodules-report-cards-checkbox"
                  value={id}
                ></Checkbox>
              ) : null}
              <Badge.Ribbon {...badgeVals} placement="start">
                <Card actions={actions} cover={<img src={thumbnail || imgFail}></img>}>
                  {err ? (
                    <span style={{ color: "red", fontSize: "20px" }}>此报告出错</span>
                  ) : (
                    <CardMeta data={item}></CardMeta>
                  )}
                </Card>
              </Badge.Ribbon>
            </label>
          </Col>,
        );

        count++;
      }
    });

    if (cols.length)
      res.push(
        <Row gutter={[10, 10]} key={`row_${res.length}`}>
          {cols}
        </Row>,
      );

    return res;
  };

  if (!data || !data.results.length)
    return (
      <div className="resources-lung-nodules-report-cards">
        <Empty></Empty>
      </div>
    );

  return (
    <div className="resources-lung-nodules-report-cards">
      <Checkbox.Group
        style={{ width: "100%" }}
        value={selected}
        onChange={(res): void => {
          onSelected && onSelected(res as string[]);
        }}
      >
        {getContent(data.results)}
      </Checkbox.Group>

      {current ? (
        <Modal onCancel={(): void => setCurrent(undefined)}>
          <LungNoduleReport data={current}></LungNoduleReport>
        </Modal>
      ) : null}
    </div>
  );
};

export default LungNodulesReportCards;
