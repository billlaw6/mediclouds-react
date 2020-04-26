import { FileProgressStatusEnum } from "_components/FileProgress/type";

export interface UploadStatusI {
  id: string;
  count: number;
  progress: number;
  status: FileProgressStatusEnum;
  filePath?: string;
  failText?: string;
}

// export interface UploadStateI {
//   uploadList: UploadStatusI[];
//   delPrivacy: boolean;
// }
