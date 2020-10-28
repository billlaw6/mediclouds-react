/* eslint-disable react/display-name */
import { Button, message, Popconfirm, Spin, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { FunctionComponent, ReactNode, useState } from "react";
import { useHistory } from "react-router-dom";
import { generateLungNodule } from "_api/ai";
import useAccount from "_hooks/useAccount";
import useResources from "_hooks/useResources";
import { GetSearchQueryPropsI, SearchQueryResI } from "_types/api";
import { ExamIndexI } from "_types/resources";
import ListDesc from "../ListDesc";

import "./style.less";

interface ExamTablePropsI {
  searchQuery: GetSearchQueryPropsI;
  isSelectable?: boolean; // 是否选择模式
  selected?: string[]; // 已选择的id
  data?: SearchQueryResI<ExamIndexI>;
  onSelected?: (vals: string[]) => void;
  onChangePagination?: (current: number) => void; // 当页码更新时触发
  onUpdateDescSuccess?: Function; // 当更新desc成功时触发
}

const ExamTable: FunctionComponent<ExamTablePropsI> = (props) => {
  const history = useHistory();
  const { account } = useAccount();
  const {
    isSelectable,
    selected,
    data,
    searchQuery,
    onSelected,
    onChangePagination,
    onUpdateDescSuccess,
  } = props;
  const { current, size } = searchQuery;
  const { updateExamDesc } = useResources();
  const [onPending, setOnPending] = useState(false); // 是否在发送请求

  const columns: ColumnsType<ExamIndexI> = [
    { title: "类型", key: "modality", dataIndex: "modality" },
    { title: "姓名", key: "patient_name", dataIndex: "patient_name" },
    { title: "检查日期", key: "study_date", dataIndex: "study_date" },
    {
      title: "AI报告",
      key: "id",
      dataIndex: "id",
      render: (id, record) => {
        const children: ReactNode[] = [];
        if (record.lung_nodule_flag)
          children.push(
            <Popconfirm
              key={id}
              title="确定消费1000积分获取简易AI报告吗？"
              onConfirm={(e): void => {
                e && e.stopPropagation();
                if (account.score <= 1000) {
                  message.warn({
                    content: "积分不足，无法创建AI报告",
                  });
                } else {
                  setOnPending(true);
                  generateLungNodule(record.id)
                    .then((res) => {
                      setOnPending(false);
                      message.success({
                        content: "报告创建中，请3-5分钟后刷新页面查看",
                      });
                    })
                    .catch((err) => {
                      setOnPending(false);
                      message.error({
                        content: "报告创建失败，请重试",
                      });
                    });
                }
              }}
              onCancel={(e): void => {
                e && e.stopPropagation();
              }}
            >
              <Button
                onClick={(e): void => {
                  e.stopPropagation();
                }}
                key="lung-nodules"
              >
                肺结节AI筛查
              </Button>
            </Popconfirm>,
          );

        return <div className="exam-table-ai">{children}</div>;
      },
    },
    {
      title: "备注",
      key: "desc",
      dataIndex: "desc",
      className: "exam-table-desc",
      render: (val, record): ReactNode => {
        return (
          <ListDesc
            desc={val}
            updateDesc={(value: string): void => {
              updateExamDesc(record.id, value)
                .then(() => {
                  message.success("更新描述成功！");
                  onUpdateDescSuccess && onUpdateDescSuccess();
                })
                .catch(() => message.error("更新描述失败！"));
            }}
          ></ListDesc>
        );
      },
    },
  ];

  return (
    <Spin
      delay={200}
      className="resources-exam-table-spin"
      spinning={onPending}
      tip="正在请求肺结节AI筛查"
    >
      <Table
        rowKey="id"
        dataSource={data ? data.results : []}
        columns={columns}
        onRow={(item) => ({
          onClick: (): void => {
            !isSelectable && history.push(`/player/?exam=${item.id}`);
          },
        })}
        rowSelection={
          isSelectable
            ? {
                selectedRowKeys: selected,
                onChange: (vals): void => onSelected && onSelected(vals as string[]),
              }
            : undefined
        }
        pagination={{
          position: ["bottomLeft"],
          current,
          pageSize: size,
          total: data ? data.count : 0,
          onChange: (current): void => {
            onChangePagination && onChangePagination(current);
          },
        }}
      ></Table>
    </Spin>
  );
};

export default ExamTable;
