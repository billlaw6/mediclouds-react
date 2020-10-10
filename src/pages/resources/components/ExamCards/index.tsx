import { Row, Col, Pagination, message } from "antd";
import { Gutter } from "antd/lib/grid/row";
import { count } from "console";
import React, { FunctionComponent, ReactElement } from "react";
import { useHistory } from "react-router-dom";
import { personalReq } from "_axios";
import DicomCard from "_components/DicomCard/DicomCard";
import { getSelected } from "_helper";
import useResources from "_hooks/useResources";
import { GetSearchQueryPropsI, SearchQueryResI } from "_types/api";
import { ExamIndexI } from "_types/resources";

interface ExamCardsPropsI {
  data?: SearchQueryResI<ExamIndexI>;
  searchQuery: GetSearchQueryPropsI;
  isSelectable?: boolean; // 是否选择模式
  selected?: string[]; // 已选择的id
  onSelected?: (selected: string[]) => void; //  当选择时触发
  onChangePagination?: (current: number) => void; // 当页码更新时触发
  onUpdateDescSuccess?: Function; // 当更新描述成功时
}

const ExamCards: FunctionComponent<ExamCardsPropsI> = (props) => {
  const {
    data,
    searchQuery,
    isSelectable,
    selected = [],
    onSelected,
    onChangePagination,
    onUpdateDescSuccess,
  } = props;

  const history = useHistory();
  const { updateExamDesc } = useResources();
  const { current, size } = searchQuery;
  const rows: ReactElement[] = [];
  let cols: ReactElement[] = [];
  const gutter: [Gutter, Gutter] = [
    { xs: 8, sm: 16, md: 24 },
    { xs: 20, sm: 30, md: 40 },
  ];

  const onClickItem = (id: string): void => {
    if (!isSelectable) {
      history.push("/player", { id });
    } else {
      // 点击单个时触发
      const list = getSelected(selected, id);
      onSelected && onSelected(list);
    }
  };

  const updateDesc = (id: string, value: string): void => {
    // 更新desc
    updateExamDesc(id, value)
      .then(() => {
        message.success("更新描述成功！");
        onUpdateDescSuccess && onUpdateDescSuccess();
      })
      .catch(() => message.error("更新描述失败！"));
  };

  if (data) {
    const { results } = data;
    let count = 0;

    results.forEach((item) => {
      const { id, patient_name, study_date, desc, thumbnail, modality } = item;
      if (count >= 4) {
        count = 0;
        rows.push(
          <Row key={rows.length} gutter={gutter} align="middle">
            {cols}
          </Row>,
        );
        cols = [];
      }

      cols.push(
        <Col key={id} xs={24} md={12} lg={8} xl={6}>
          <DicomCard
            id={id}
            patientName={patient_name}
            studyDate={study_date}
            desc={desc}
            thumbnail={thumbnail}
            modality={modality}
            checkbox={isSelectable}
            checked={selected.indexOf(id) > -1}
            onClick={(): void => onClickItem(id)}
            updateDesc={(value: string): void => updateDesc(id, value)}
          ></DicomCard>
        </Col>,
      );
    });
  }

  rows.push(
    <Row key={rows.length} gutter={gutter} align="top">
      {cols}
    </Row>,
  );

  return (
    <div className="resources-exam-cards">
      {rows}
      <Pagination
        hideOnSinglePage={true}
        current={current}
        pageSize={size}
        total={data ? data.count : 0}
        onChange={(page): void => {
          onChangePagination && onChangePagination(page);
        }}
      ></Pagination>
    </div>
  );
};

export default ExamCards;
