import { publicReq } from "_axios";

/**
 * 上传资源
 *
 * @param {FormData} data
 * @param {(progressEvent: ProgressEvent) => void} [onUploadProgress]
 * @returns {Promise<void>}
 */
export const uploadResources = async (
  data: FormData,
  onUploadProgress?: (progressEvent: ProgressEvent) => void,
): Promise<void> => {
  await publicReq({
    method: "POST",
    url: "/resources/upload/",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

/* 获取dicom资源列表 */
export const getDicomList = async (id: string) =>
  await publicReq({
    method: "GET",
    url: "/resources/dicom-list/",
  });
