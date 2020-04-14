/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent } from "react";
import { GalleryListPropsI } from "_pages/gallery/type";

import "./List.less";
import { Table } from "antd";
import { GalleryI } from "_constants/interface";

/* 

  {
  upload_to: string; // 上传文件路径
  md5: string; // 文件的MD5值
  source: string; // 来源类型
  doi: string; // 文章DOI值
  title: string; // 文章标题
  journal: string; // 杂志
  authors: string; // 作者
  source_url: string; // 资源链接
  description: string; // 描述
  figure_series: string; // 图片在文章里的序列号
  pictures: string[]; // 图片url地址数组
  dicom_flag: string; // 是否是DICOM文件
  flag: string; // 可视标志
  published_at: string; // 文章发表时间
  created_at: string; // 资源收录时间
}

*/

const columns = [
  { title: "ID", key: "id", dataIndex: "id" },
  { title: "标题", key: "title", dataIndex: "title" },
  { title: "作者", key: "authors", dataIndex: "authors" },
  { title: "描述", key: "description", dataIndex: "description" },
  { title: "上传路径", key: "upload_to", dataIndex: "upload_to" },
  // { title: "md5值", key: "md5", dataIndex: "md5" },
  { title: "来源类型", key: "source", dataIndex: "source" },
  { title: "DOI值", key: "doi", dataIndex: "doi" },
  { title: "杂志", key: "journal", dataIndex: "journal" },
  { title: "资源链接", key: "source_url", dataIndex: "source_url" },
  { title: "是否为DICOM文件", key: "dicom_flag", dataIndex: "dicom_flag" },
  { title: "是否可见", key: "flag", dataIndex: "flag" },
  { title: "发表时间", key: "published_at", dataIndex: "published_at" },
  { title: "收录时间", key: "created_at", dataIndex: "created_at" },
  { title: "编辑", key: "edit", dataIndex: "edit" },
];

/* 过滤 */
const filter = (items: GalleryI[], search?: { date?: string; title?: string }): GalleryI[] => {
  if (!search) return items;
  const { title, date } = search;

  let res = [...items];
  if (title) res = res.filter((item) => item.title.indexOf(title) >= 0);
  if (date) res = res.filter((item) => item.published_at.indexOf(date) >= 0);

  /* 还要加上是否显示的过滤 */

  return res;
};

const GalleryList: FunctionComponent<GalleryListPropsI> = (props) => {
  const { items, search, onClick, onSelect } = props;

  /* 处理某些字段 */
  const handle = (items: GalleryI[]): (GalleryI & { edit: JSX.Element })[] =>
    items.map((item) => {
      const res: GalleryI & { edit: JSX.Element } = Object.assign({}, item, {
        edit: (
          <div
            className="gallery-list-item"
            onClick={(): void => {
              onClick && onClick(item);
            }}
          >
            编辑
          </div>
        ),
      });
      res.dicom_flag = res.dicom_flag === "1" ? "是" : "否";
      res.flag = res.flag === "1" ? "是" : "否";
      switch (res.source) {
        case "article":
          res.source = "文章";
          break;
        case "ppt":
          res.source = "幻灯片";
          break;
        case "public_db":
          res.source = "公共数据";
          break;
        default:
          break;
      }

      return res;
    });

  return (
    <Table
      rowSelection={{
        type: "checkbox",
        onChange: onSelect,
      }}
      className="gallery-list"
      rowKey="id"
      dataSource={handle(filter(items, search))}
      columns={columns}
    ></Table>
  );
};

export default GalleryList;
