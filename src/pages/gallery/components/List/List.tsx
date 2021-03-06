/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent } from "react";
import { GalleryListPropsI } from "_pages/gallery/type";
import { Table } from "antd";
import { PublicGalleryI } from "mc-api";
import moment from "moment";

import "./List.less";
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
  // { title: "上传路径", key: "upload_to", dataIndex: "upload_to" },
  // { title: "md5值", key: "md5", dataIndex: "md5" },
  { title: "来源类型", key: "source", dataIndex: "source" },
  { title: "序列分组", key: "series_id", dataIndex: "series_id", width: 180 },
  { title: "DOI值", key: "doi", dataIndex: "doi" },
  { title: "杂志", key: "journal", dataIndex: "journal" },
  { title: "资源链接", key: "source_url", dataIndex: "source_url" },
  {
    title: "是否为DICOM文件",
    key: "dicom_flag",
    dataIndex: "dicom_flag",
    render: (text: number): string => (text === 1 ? "是" : "否"),
  },
  // { title: "是否可见", key: "flag", dataIndex: "flag" },
  { title: "发表时间", key: "published_at", dataIndex: "published_at" },
  { title: "收录时间", key: "created_at", dataIndex: "created_at" },
  { title: "编辑", key: "edit", dataIndex: "edit" },
];

/* 过滤 */
const filter = (
  items: PublicGalleryI[],
  search?: { date?: [string, string]; title?: string; desc?: string; imgType?: string },
): PublicGalleryI[] => {
  if (!search) return items;
  const { title, date, desc, imgType } = search;

  let res = [...items];
  if (imgType && imgType !== "_NONE_") res = res.filter((item) => item.image_type === imgType);
  if (title) res = res.filter((item) => item.title.indexOf(title) >= 0);
  if (desc) res = res.filter((item) => item.description.indexOf(desc) >= 0);
  if (date && date.length)
    res = res.filter((item) => {
      return moment(item.published_at).isBetween(...date);
    });

  /* 还要加上是否显示的过滤 */

  /* 排序 */
  res.sort((a, b) => {
    return moment(b.created_at).isAfter(moment(a.created_at)) ? 1 : -1;
  });

  return res;
};

const GalleryList: FunctionComponent<GalleryListPropsI> = (props) => {
  const { items, search, onClick, onSelect } = props;
  const dicoms: PublicGalleryI[] = [],
    imgs: PublicGalleryI[] = [];

  items.forEach((item) => {
    const { dicom_flag, series_id, created_at, ...others } = item;
    if (dicom_flag) {
      const index = dicoms.findIndex((item) => item.series_id === series_id);
      if (index >= 0) {
        dicoms[index] = { ...others, series_id, dicom_flag, created_at };
      } else {
        dicoms.push(item);
      }
    } else {
      imgs.push(item);
    }
  });

  /* 处理某些字段 */
  const handle = (items: PublicGalleryI[]) =>
    items.map((item) => {
      const res = Object.assign({}, item, {
        // dicom_flag: item.dicom_flag === 1 ? "是" : "否",
        // flag: item.flag === 1 ? "是" : "否",
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
      dataSource={handle(filter([...dicoms, ...imgs], search))}
      columns={columns}
    ></Table>
  );
};

export default GalleryList;
