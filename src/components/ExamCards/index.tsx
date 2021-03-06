import {
  Row,
  Col,
  Pagination,
  message,
  Button,
  Spin,
  Modal,
  Empty as AntdEmpty,
  Tooltip,
} from "antd";
import { Gutter } from "antd/lib/grid/row";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useHistory } from "react-router-dom";
import { generateLungNodule, SearchQueryPropsI, SearchQueryResI, ExamListItemI } from "mc-api";
import DicomCard from "_components/DicomCard/DicomCard";
import { getSelected } from "_helper";
import useOrder from "_hooks/useOrder";
import useResources from "_hooks/useResources";

import Empty from "_pages/resources/components/Empty";

import "./style.less";

interface ExamCardsPropsI {
  data?: SearchQueryResI<ExamListItemI>;
  searchQuery: SearchQueryPropsI;
  isSelectable?: boolean; // 是否选择模式
  selected?: ExamListItemI[]; // 已选择的id
  onSelected?: (selected: ExamListItemI[]) => void; //  当选择时触发
  onChangePagination?: (current: number) => void; // 当页码更新时触发
  onUpdateDescSuccess?: Function; // 当更新描述成功时
  disabledDesc?: boolean; // 不显示备注
  disabledAi?: boolean; // 禁用AI功能
  hiddenAi?: boolean; // 不显示AI功能
  disabledEmptyTip?: boolean; // 不显示空的情况下提醒用户上传DICOM
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
    disabledDesc,
    disabledAi,
    hiddenAi,
    disabledEmptyTip,
  } = props;
  const { buyLungNodulesReport } = useOrder();

  const [onPending, setOnPending] = useState(false); // 是否在发送请求
  const history = useHistory();
  const { updateExamDesc } = useResources();
  const { current, size } = searchQuery;
  const rows: ReactElement[] = [];
  let cols: ReactElement[] = [];
  const gutter: [Gutter, Gutter] = [
    { xs: 8, sm: 16, md: 24 },
    { xs: 20, sm: 30, md: 40 },
  ];

  const generateReport = (id: string): void => {
    Modal.confirm({
      centered: true,
      title: "免责声明",
      content: (
        <div>
          为了遵守中华人民共和国的相关法律法规，医影只为您提供CT影像学AI筛查服务。我们服务提供的预测结果不能被解释或作为临床诊断。本平台将根据您提交的CT图像提供模型预测。请您根据实际情况咨询医生或就诊。
        </div>
      ),
      okText: "创建（限时免费）",
      cancelText: "取消",
      onOk: () => {
        setOnPending(true);
        generateLungNodule(id)
          .then((res) => {
            setOnPending(false);
            if (res === 1) {
              message.success({
                content: "AI筛查请求已经发送成功，请您耐心等待短信通知",
              });
            } else {
              message.error({
                content: "此检查已生成过肺结节AI筛查",
              });
            }
          })
          .catch((err) => {
            message.error({
              content: err.message === "402" ? "积分不足，无法创建AI报告" : "报告创建失败，请重试",
            });
            setOnPending(false);
          });
        // }
      },
    });
  };

  const onClickItem = (exam: ExamListItemI): void => {
    if (!isSelectable) {
      history.push(`/player/?exam=${exam.id}`);
    } else {
      // 点击单个时触发
      const list = getSelected(selected, exam) as ExamListItemI[];
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

  if (!data) return null;

  const { results } = data;
  if (!results || !results.length)
    return disabledEmptyTip ? (
      <AntdEmpty image={AntdEmpty.PRESENTED_IMAGE_SIMPLE} description="没有相关检查资料" />
    ) : (
      <Empty></Empty>
    );

  let count = 0;

  results.forEach((item) => {
    const { id, patient_name, study_date, desc, thumbnail, modality, lung_nodule_flag } = item;
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
          checked={selected.findIndex((item) => item.id === id) > -1}
          onClick={(): void => onClickItem(item)}
          updateDesc={(value: string): void => updateDesc(id, value)}
          disabledDesc={disabledDesc}
        ></DicomCard>
        {lung_nodule_flag && !hiddenAi ? (
          <div>
            <span>AI功能：</span>
            {disabledAi ? (
              <Tooltip title="请等待全部DICOM解析完成再使用AI筛查功能">
                <Button disabled={true} key="lung-nodules">
                  肺结节AI筛查
                </Button>
              </Tooltip>
            ) : (
              <Button
                onClick={(e): void => {
                  e.stopPropagation();
                  generateReport(id);
                }}
                key="lung-nodules"
              >
                肺结节AI筛查
              </Button>
            )}
          </div>
        ) : null}
      </Col>,
    );
  });

  rows.push(
    <Row key={rows.length} gutter={gutter} align="top">
      {cols}
    </Row>,
  );

  return (
    <Spin
      delay={200}
      className="resources-exam-cards-spin"
      spinning={onPending}
      tip="正在请求肺结节AI筛查"
    >
      <div className="resources-exam-cards">
        {rows}
        <Pagination
          hideOnSinglePage={true}
          current={current}
          pageSize={size}
          total={data.count}
          onChange={(page): void => {
            onChangePagination && onChangePagination(page);
          }}
        ></Pagination>
      </div>
    </Spin>
  );
};

export default ExamCards;
