/* eslint-disable react/display-name */
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { FunctionComponent, ReactNode, useState } from "react";
import { useHistory } from "react-router-dom";
import { formatDate } from "_helper";
import { GetSearchQueryPropsI, SearchQueryResI } from "_types/api";
import { PdfI } from "_types/resources";
import PdfViewer from "./PdfViewer";

interface PdfTablePropsI {
  searchQuery: GetSearchQueryPropsI;
  isSelectable?: boolean; // 是否选择模式
  selected?: string[]; // 已选择的id
  data?: SearchQueryResI<PdfI>; // 数据
  onSelected?: (vals: string[]) => void;
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

  return (
    <>
      <Table
        rowKey="id"
        dataSource={data ? data.results : []}
        columns={columns}
        onRow={(item) => ({
          onClick: (): void => {
            !isSelectable && setCurrentPdf(item);
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
      <PdfViewer data={currentPdf} onClose={(): void => setCurrentPdf(null)}></PdfViewer>
    </>
  );
};

export default PdfTable;
