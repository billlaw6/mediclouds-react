/* eslint-disable react/display-name */
import { Input, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { FunctionComponent, ReactNode, useState } from "react";
import { ExamIndexI } from "_types/api";

interface ExamTablePropsI {
  data: ExamIndexI[];
  editRowId?: string; // 正在编辑备注的行ID
}

const ExamTable: FunctionComponent<ExamTablePropsI> = (props) => {
  const { data, editRowId } = props;
  const [selected, setSelected] = useState<string[]>([]);

  const columns: ColumnsType<ExamIndexI> = [
    { title: "类型", key: "modality", dataIndex: "modality" },
    { title: "姓名", key: "patient_name", dataIndex: "patient_name" },
    { title: "检查日期", key: "study_date", dataIndex: "study_date" },
    {
      title: "备注",
      key: "desc",
      dataIndex: "desc",
      render: (val, record): ReactNode => {
        if (record.id === editRowId)
          return <Input defaultValue={record.desc} placeholder="添加备注"></Input>;
        return <span>{val}</span>;
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      dataSource={data}
      columns={columns}
      rowSelection={{ selectedRowKeys: selected }}
    ></Table>
  );
};

export default ExamTable;
