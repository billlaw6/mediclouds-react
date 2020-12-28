/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent, useEffect, useState, ReactElement, useCallback } from "react";
import { Table, Button, Popconfirm, Alert, Space } from "antd";

import EditPanel from "./EditPanel/EditPanel";
import { delWechatCover, getWechatCoverList, WechatCoverI } from "mc-api";

import "./HomeResource.less";

const columns = [
  { key: "id", title: "id", dataIndex: "id" },
  {
    key: "img_url",
    title: "图片",
    dataIndex: "img_url",
    render: (url: string): ReactElement => <img src={url || ""}></img>,
  },
  { key: "link_url", title: "跳转地址", dataIndex: "link_url", ellipsis: true },
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

const HomeResource: FunctionComponent = () => {
  const [res, setRes] = useState<WechatCoverI[]>([]);
  const [editItem, setEditItem] = useState<WechatCoverI>();
  const [editStatus, setEditStatus] = useState<{ show: boolean; type: "edit" | "create" }>({
    show: false,
    type: "create",
  });
  const [checked, setChecked] = useState<string[]>([]);

  const handleRes = () => {
    if (!res) return;

    return [...res].map((item) => {
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

  const del = () => {
    delWechatCover(checked)
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
    getWechatCoverList()
      .then((res) => setRes(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="home-res">
      <Space direction="vertical">
        <Alert
          message={
            <span>
              跳转地址格式为: <b>/pages/</b>
              <i style={{ color: "green" }}>[需要跳转的小程序页面]</i>
              <b>/index</b>
            </span>
          }
        ></Alert>
        <Alert
          showIcon
          closable
          type="warning"
          message={
            <span>
              当需要跳转微信公众号页面时，请将跳转地址改为 <b>/pages/web/index?url=</b>
              <i style={{ color: "red" }}>[需要跳转的url地址]</i>
            </span>
          }
        ></Alert>
        <Alert
          showIcon
          closable
          type="warning"
          message={
            <span>
              当需要跳转web页面时，请将跳转地址改为 <b>/pages/web/index?mi=</b>
              <i style={{ color: "red" }}>[需要跳转的url地址]</i>
            </span>
          }
        ></Alert>
      </Space>
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
        onOk={() => {
          getWechatCoverList()
            .then((res) => {
              setRes(res);
              setEditStatus(Object.assign({}, editStatus, { show: false }));
            })
            .catch((err) => console.log(err));
          // init()
          //   .then(() => {
          //
          //   })
          //   .then((err) => console.error(err));
        }}
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
        dataSource={handleRes()}
        columns={columns}
      ></Table>
    </div>
  );
};

export default HomeResource;
