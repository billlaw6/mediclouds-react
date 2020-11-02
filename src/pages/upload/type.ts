import { UploaderStatusE } from "_types/api";

export interface UploadStatusI {
  id: string;
  count: number;
  progress: number;
  status: UploaderStatusE;
  filePath?: string;
  failText?: string;
  errFiles?: string[]; // 本次上传无效文件数组
}

// export interface UploadStateI {
//   uploadList: UploadStatusI[];
//   delPrivacy: boolean;
// }
