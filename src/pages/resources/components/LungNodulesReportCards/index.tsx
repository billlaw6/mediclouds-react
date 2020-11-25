import { Card, Checkbox, Col, Empty, Grid, Row, Modal, Pagination } from "antd";
import React, { FunctionComponent, ReactNode, useState } from "react";
import { formatDate } from "_helper";
import { LungNoduleReportI } from "_types/ai";
import { GetSearchQueryPropsI, SearchQueryResI } from "_types/api";
import LungNoduleReport from "_components/LungNoduleReport";

import Desc from "_components/LungNoduleReport/components/Desc";
import imgFail from "_assets/images/img-fail.png";
import useReport from "_hooks/useReport";

import "./style.less";

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
  const { patient_name, sex, desc, study_date, err } = data;

  const content = (
    <div>
      <span>姓名: {patient_name}</span>
      <br />
      <span>性别: {sex}</span>
      <br />
      <span>检查日期: {formatDate(study_date)}</span>
      <br />
      {err ? (
        <>
          <span style={{ color: "red" }}>
            AI检测失败
            <br />
            <i>{desc}</i>
          </span>
        </>
      ) : (
        <span>
          分析结果: <Desc extra>{desc}</Desc>
        </span>
      )}
    </div>
  );

  return <Meta title={`${patient_name} / ${sex}`} description={content}></Meta>;
};

const LungNodulesReportCards: FunctionComponent<LungNodulesReportCardsPropsI> = (props) => {
  const { data, selected, isSelectable, onSelected, searchQuery, onChangePagination } = props;
  const { current, size } = searchQuery;

  const { lungNodule, updateLungNodule } = useReport();
  const screen = useBreakpoint();
  const [openModal, setOpenModal] = useState(false);

  // const [currentReport, setCurrentReport] = useState<LungNoduleReportI>();

  const getColCount = (): number => {
    const { xs, sm, xl, lg } = screen;

    if (xl) return SCREEN_SIZE_LIST.xl;
    if (lg) return SCREEN_SIZE_LIST.md;
    if (sm) return SCREEN_SIZE_LIST.sm;
    if (xs) return SCREEN_SIZE_LIST.xs;

    return SCREEN_SIZE_LIST.xl;
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
      }
      const { id, thumbnail = "", err, exam_id } = item;
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
            <Card
              onClick={(): void => {
                if (isSelectable || err) return;
                if (!lungNodule || item.id !== lungNodule.id) {
                  updateLungNodule(item);
                }

                setOpenModal(true);
              }}
              hoverable
              cover={<img src={thumbnail || imgFail}></img>}
              style={{ cursor: !isSelectable && !!err ? "not-allowed" : "pointer" }}
            >
              <CardMeta data={item}></CardMeta>
            </Card>
          </label>
        </Col>,
      );

      count++;
    });

    cols.length &&
      res.push(
        <Row gutter={[10, 10]} key={`row_${res.length}`}>
          {cols}
        </Row>,
      );

    return res;
  };

  if (!data) return null;

  if (!data.results.length)
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
        {data ? getContent(data.results) : null}
      </Checkbox.Group>
      <Pagination
        style={{ marginTop: `${20}px` }}
        current={current}
        pageSize={size}
        total={data ? data.count : 0}
        onChange={(page): void => {
          onChangePagination && onChangePagination(page);
        }}
      ></Pagination>
      <Modal
        title={lungNodule ? `${lungNodule.patient_name}的肺结节AI筛查报告` : null}
        destroyOnClose
        width={1000}
        visible={openModal}
        onCancel={(): void => setOpenModal(false)}
        footer={null}
      >
        <LungNoduleReport></LungNoduleReport>
      </Modal>
    </div>
  );
};

export default LungNodulesReportCards;
