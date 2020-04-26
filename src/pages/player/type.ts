import { ImageI, SeriesListI } from "_constants/interface";

export interface PatientI {
  patient_name: string;
  patient_id: string;
  birthday: string;
  sex: string;
  study_date: string;
  institution_name: string;
  modality: string;
}

/* 缓存的普通series的images列表 */
export type SeriesImgCacheListT = HTMLImageElement[][];

export type PlayerModeT = "normal" | "mpr";

export interface MprImgSizeI {
  width: number;
  height: number;
}
export interface MprImgClientRects extends MprImgSizeI {
  x: number;
  y: number;
}
export interface MprImgAndSizeI extends MprImgSizeI {
  img: HTMLImageElement;
}
export interface ImgDrawInfoI extends MprImgClientRects {
  img: HTMLImageElement;
}

export interface PlayerStateI {
  seriesIndex: number; // 当前序列索引
  imgIndex: number[]; // 所有序列的当前图像索引
  play: boolean; // 是否在播放
  fullscreen: boolean; // is fullscreen mode
  $wrapper: Element | null; // wrapper element
  wrapperClassName: string; // wrapper element classname
  showInfo: boolean; // 是否显示病人信息
  showPanels: boolean; // 全屏时是否显示info、list、ctl等
  seriesCacheList: SeriesImgCacheListT; // 正常模式下 序列图像的缓存

  seriesList: SeriesListI;
  imageList: ImageI[];
}
