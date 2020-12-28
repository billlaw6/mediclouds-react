/* eslint-disable react/display-name */
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { PdfI, SearchQueryPropsI, SearchQueryResI } from "mc-api";
import React, { FunctionComponent, ReactNode, useState } from "react";
import { formatDate } from "_helper";

import PdfViewer from "./PdfViewer";

interface PdfTablePropsI {
  searchQuery: SearchQueryPropsI;
  isSelectable?: boolean; // 是否选择模式
  selected?: PdfI[]; // 已选择的id
  data?: SearchQueryResI<PdfI>; // 数据
  onSelected?: (vals: PdfI[]) => void;
  onChangePagination?: (current: number) => void; // 当页码更新时触发
}

const PdfTable: FunctionComponent<PdfTablePropsI> = (props) => {
  const { isSelectable, selected, data, searchQuery, onSelected, onChangePagination } = props;
  const { current, size } = searchQuery;
  const [currentPdf, setCurrentPdf] = useState<PdfI | null>(null);

  const columns: ColumnsType<PdfI> = [
    { title: "文件名", key: "filename", dataIndex: "filename" },
    { title: "类型", key: "filetype", dataIndex: "filetype" },
    {
      title: "上传日期",
      key: "created_at",
      dataIndex: "created_at",
      render: (val): ReactNode => {
        return <span>{formatDate(val, true)}</span>;
      },
    },
  ];

  if (!data) return null;

  return (
    <>
      <Table
        rowKey="id"
        dataSource={data.results}
        columns={columns}
        onRow={(item) => ({
          onClick: (): void => {
            !isSelectable && setCurrentPdf(item);
          },
        })}
        rowSelection={
          isSelectable
            ? {
                selectedRowKeys: selected?.map((item) => item.id),
                onChange: (vals): void => {
                  const res = data.results.filter((item) => vals.indexOf(item.id) > -1);
                  onSelected && onSelected(res);
                },
              }
            : undefined
        }
        pagination={{
          position: ["bottomLeft"],
          current,
          pageSize: size,
          total: data.count,
          onChange: (current): void => {
            onChangePagination && onChangePagination(current);
          },
        }}
      ></Table>
      <PdfViewer data={currentPdf} onClose={(): void => setCurrentPdf(null)}></PdfViewer>
    </>
  );
};

export default PdfTable;
