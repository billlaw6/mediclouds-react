import { PublicGalleryI, PublicGalleryStatsI } from "mc-api";

export interface GalleryListPropsI {
  search?: {
    date?: [string, string];
    title?: string;
  }; // 搜索字段
  items: PublicGalleryI[]; // 图集
  onClick?: (item: PublicGalleryI) => void; // 点击某条字段触发
  onSelect?: (
    selectedRowKeys: (string | number)[],
    selectedRows: (PublicGalleryI & { edit: JSX.Element })[],
  ) => void;
}

export interface EditorPanelPropsI {
  isShow: boolean; // 是否显示
  gallery: PublicGalleryI;
  onCancel?: Function;
  onUpdate?: (gallery: PublicGalleryI) => void; // 更新完毕
  onUpload?: (gallery: PublicGalleryI) => void; // 上传完毕
  uploadMode?: boolean; // 是否为上传模式
  seriesIds?: string[]; // 序列分组id
  galleryStats: PublicGalleryStatsI[];
}
