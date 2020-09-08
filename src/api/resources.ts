import { publicAPi } from "_axios";

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
  await publicAPi.post("/resources/upload/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};
