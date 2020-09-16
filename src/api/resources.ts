import { publicReq } from "_axios";

/**
 * 上传资源
 *
 * @param {FormData} data
 * @param {(progressEvent: ProgressEvent) => void} [onUploadProgress]
 * @returns {Promise<void>}
 */
export const uploadResources = async (
  // customer_id: string,
  // order_number: string,
  data: FormData,
  onUploadProgress?: (progressEvent: ProgressEvent) => void,
): Promise<void> => {
  await publicReq({
    method: "POST",
    url: "/resources/upload/",
    // data: {
    //   user_id: customer_id,
    //   order_number,
    //   resources: data,
    // },
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
