import { UploaderStatusE } from "_types/api";

export interface UploadStatusI {
  id: string;
  count: number;
  progress: number;
  status: UploaderStatusE;
  filePath?: string;
  failText?: string;
}

// export interface UploadStateI {
//   uploadList: UploadStatusI[];
//   delPrivacy: boolean;
// }
