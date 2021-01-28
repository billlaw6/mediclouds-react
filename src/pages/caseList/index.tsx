/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Modal, PageHeader, Table, Tabs } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { formatDate, getAgeByBirthday, getSexName } from "_helper";
import useCase from "_hooks/useCase";
import { CaseI, CaseTypeE } from "mc-api";

import "./style.less";

const { TabPane } = Tabs;

const CaseList: FunctionComponent = () => {
  const history = useHistory();
  const {
    cases,
    settings,
    fetchMineCaseList,
    fetchReadRecordCaseList,
    updateCaseTabType,
    delCase,
  } = useCase();
  const [selected, setSelected] = useState<number[]>([]);
  const [pagination, setPagination] = useState<{
    [key: string]: any;
    [CaseTypeE.MINE]: { current: number; pageSize: number };
    [CaseTypeE.READ_RECORD]: { current: number; pageSize: number };
  }>({
    [CaseTypeE.MINE]: {
      current: 1,
      pageSize: 12,
    },
    [CaseTypeE.READ_RECORD]: {
      current: 1,
      pageSize: 12,
    },
  });
  const { mineList, readRecordList } = cases;
  const { caseTabType } = settings;

  useEffect(() => {
    switch (caseTabType) {
      case CaseTypeE.MINE:
        fetchMineCaseList();
        break;
      case CaseTypeE.READ_RECORD:
        fetchReadRecordCaseList();
        break;
      default:
        break;
    }
  }, [caseTabType]);

  const columns: ColumnsType<CaseI> = [
    {
      dataIndex: "name",
      key: "name",
      title: "姓名",
    },
    {
      dataIndex: "sex",
      key: "sex",
      title: "性别",
      render: (value) => <span>{getSexName(value)}</span>,
    },
    {
      dataIndex: "birthday",
      key: "birthday",
      title: "年龄",
      render: (value) => <span>{getAgeByBirthday(value) || ""}</span>,
    },
    {
      dataIndex: "created_at",
      key: "create_at",
      title: "创建时间",
      render: (value) => <span>{formatDate(value, true)}</span>,
    },
    {
      dataIndex: "description",
      key: "description",
      title: "描述",
    },
  ];

  const updatePagination = (type: CaseTypeE, num: number): void => {
    const next = Object.assign({}, pagination[type], {
      current: num,
    });
    setPagination(
      Object.assign({}, pagination, {
        [type]: next,
      }),
    );
  };

  const comfirmDel = () => {
    Modal.confirm({
      title: "删除病例",
      content: "确认删除病例吗？",
      onOk: () =>
        delCase(selected)
          .then(() => setSelected([]))
          .catch((err) => console.error(err)),
    });
  };

  return (
    <section className="case-list">
      <PageHeader
        className="case-list-header"
        title="病例列表"
        subTitle="查看和管理病例"
        onBack={(): void => history.push("/resources")}
      >
        <Button
          danger
          disabled={!selected.length || caseTabType === CaseTypeE.READ_RECORD}
          onClick={(): void => comfirmDel()}
        >
          删除
        </Button>
      </PageHeader>
      <div>
        <Tabs
          activeKey={caseTabType}
          onChange={(item): void => {
            updateCaseTabType(item as CaseTypeE);
          }}
        >
          <TabPane tab="我的病例" key={CaseTypeE.MINE}>
            <Table
              loading={!mineList}
              rowSelection={{
                selectedRowKeys: selected,
                onChange: (vals) => setSelected(vals as number[]),
              }}
              rowKey="id"
              dataSource={mineList}
              columns={columns}
              rowClassName="case-list-item"
              onRow={(record) => ({
                onClick: () => {
                  history.push(`/case/${record.id}`);
                },
              })}
              pagination={{
                ...pagination[CaseTypeE.MINE],
                onChange: (num): void => updatePagination(CaseTypeE.MINE, num),
              }}
            ></Table>
          </TabPane>
          <TabPane tab="已查看的分享病例" key={CaseTypeE.READ_RECORD}>
            <Table
              rowKey="id"
              loading={!readRecordList}
              dataSource={readRecordList}
              columns={columns}
              rowClassName="case-list-item"
              onRow={(record) => ({
                onClick: () => {
                  history.push(`/case/${record.id}`);
                },
              })}
              pagination={{
                ...pagination[CaseTypeE.READ_RECORD],
                onChange: (num): void => updatePagination(CaseTypeE.READ_RECORD, num),
              }}
            ></Table>
          </TabPane>
        </Tabs>
      </div>
    </section>
  );
};

export default CaseList;
