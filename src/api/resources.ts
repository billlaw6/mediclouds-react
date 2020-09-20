import { publicReq } from "_axios";
import { SearchQueryResI } from "_types/api";
import { ExamIndexListI } from "_types/core";

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

/* 获取dicom检查列表 */
export const getDicomList = async (id: string): Promise<SearchQueryResI<ExamIndexListI[]>> =>
  await publicReq({
    method: "GET",
    url: `/resources/exam-list/${id}/`,
  });

/* 获取pdf资源列表 */
export const getPdfList = async (id: string) =>
  await publicReq({
    method: "GET",
    url: `/resources/pdf-list/${id}/`,
  });

/* 获取图片资源列表 */
export const getImgList = async (id: string) =>
  await publicReq({
    method: "GET",
    url: `/resources/img-list/${id}/`,
  });
