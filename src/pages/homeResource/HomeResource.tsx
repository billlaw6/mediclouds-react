/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent, useEffect, useState, ReactElement } from "react";
import { Table, Button, Popconfirm } from "antd";

import "./HomeResource.less";
import EditPanel from "./EditPanel/EditPanel";
import { HomeResI } from "./type";
import { delHomeResList } from "_services/manager";
import { cancel } from "redux-saga/effects";

const columns = [
  { key: "id", title: "id", dataIndex: "id" },
  {
    key: "img_url",
    title: "图片",
    dataIndex: "img_url",
    render: (url: string): ReactElement => <img src={url || ""}></img>,
  },
  { key: "link_url", title: "跳转地址", dataIndex: "link_url" },
  {
    key: "order",
    title: "顺序",
    dataIndex: "order",
  },
  {
    key: "edit",
    title: "编辑",
    dataIndex: "edit",
  },
];

const mock: HomeResI[] = [
  {
    id: "1",
    img_url: "https://www.baidu.com/favicon.ico",
    link_url: "/page/gallery/index",
    order: 0,
  },
  {
    id: "2",
    img_url: "https://www.google.com.hk/favicon.ico",
    link_url: "/page/gallery/index",
    order: 1,
  },
];

const HomeResource: FunctionComponent = () => {
  const [res, setRes] = useState<HomeResI[]>([]);
  const [editItem, setEditItem] = useState<HomeResI>();
  const [editStatus, setEditStatus] = useState<{ show: boolean; type: "edit" | "create" }>({
    show: false,
    type: "create",
  });
  const [checked, setChecked] = useState<string[]>([]);

  console.log("checked", checked);

  const handleRes = (data: HomeResI[]) => {
    return data.map((item) => {
      return Object.assign({}, item, {
        edit: (
          <Button
            onClick={() => {
              setEditItem(item);
              setEditStatus({ show: true, type: "edit" });
            }}
          >
            edit
          </Button>
        ),
      });
    });
  };

  const init = async () => {
    // 先拉取homeres数据
    /* const _resListRes = await getHomeResList(); */
    setRes(mock);
  };

  const del = () => {
    delHomeResList(checked)
      .then(() => {
        setRes(res.filter((item) => checked.indexOf(item.id || "") < 0));
        setChecked([]);
      })
      .catch((err) => console.error(err));
  };

  const create = () => {
    setEditItem({});
    setEditStatus({ show: true, type: "create" });
  };

  useEffect(() => {
    init()
      .then(() => {
        console.log("===> successed <===");
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="home-res">
      <header className="home-res-header">
        <h1 className="home-res-title">首页图片管理</h1>
        <div className="home-res-ctl">
          <Button className="home-res-btn" onClick={() => create()}>
            新建
          </Button>

          <Popconfirm
            title={`是否要删除所选的${checked.length}个图片？`}
            disabled={checked.length <= 0}
            onConfirm={del}
            // onCancel={cancel}
            okText="删除"
            cancelText="取消"
          >
            <Button className="home-res-btn" danger>
              删除
            </Button>
          </Popconfirm>
        </div>
      </header>
      <EditPanel
        data={editItem}
        status={editStatus}
        onCancel={() => setEditStatus(Object.assign({}, editStatus, { show: false }))}
        onOk={() => setEditStatus(Object.assign({}, editStatus, { show: false }))}
      ></EditPanel>
      <Table
        rowSelection={{
          type: "checkbox",
          onChange: (selectedIds) => {
            setChecked(selectedIds as string[]);
          },
        }}
        rowKey="id"
        className="home-res-table"
        dataSource={handleRes(res)}
        columns={columns}
      ></Table>
    </div>
  );
};

export default HomeResource;
