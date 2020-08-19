import { GalleryI, GalleryStatsI } from "_types/api";
import { ElementRef } from "react";

export interface GalleryListPropsI {
  search?: {
    date?: [string, string];
    title?: string;
  }; // 搜索字段
  items: GalleryI[]; // 图集
  onClick?: (item: GalleryI) => void; // 点击某条字段触发
  onSelect?: (
    selectedRowKeys: (string | number)[],
    selectedRows: (GalleryI & { edit: JSX.Element })[],
  ) => void;
}

export interface EditorPanelPropsI {
  isShow: boolean; // 是否显示
  gallery: GalleryI;
  onCancel?: Function;
  onUpdate?: (gallery: GalleryI) => void; // 更新完毕
  onUpload?: (gallery: GalleryI) => void; // 上传完毕
  uploadMode?: boolean; // 是否为上传模式
  seriesIds?: string[]; // 序列分组id
  galleryStats: GalleryStatsI[];
}
