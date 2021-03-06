import { UploaderStatusE } from "_types/api";

export interface FileProgressPropsI {
  count: number; // 文件数量
  progress: number; // 当前进度 百分比
  status: UploaderStatusE; // 当前状态
  filePath?: string; // 文件路径
  errFiles?: string[]; // 本次无效文件名数组
  successText?: string; // 成功时显示的文字
  failText?: string; // 失败时显示的文字
  pendingText?: string; // 上传中显示的文字
  onReload?: Function; // 重新加载的回调函数
}
