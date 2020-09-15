import { personalReq } from ".";
import { GalleryI, GalleryStatsI } from "_types/api";
import { ExamIndexListI } from "_types/core";

export const getExamIndex = async (params?: any): Promise<ExamIndexListI[]> => {
  const res = await personalReq({
    method: "GET",
    url: "/dicom/exam-index/",
    params,
  });

  console.log("get exam", res);

  return res;
};

export const deleteExamIndex = async (data: string[]) =>
  await personalReq({ method: "POST", url: "/dicom/exam-index/del/", data });

export const getExamIndexDetail = async (params: any) =>
  await personalReq({
    method: "GET",
    url: `/dicom/exam-index/${params.id}/`,
    params,
  });

export const getDicomSeries = async (id: string) =>
  await personalReq({
    method: "GET",
    url: `/dicom/exam-index/${id}/`,
  });

export const getDicomSeriesDetail = async (params: any) =>
  await personalReq({
    method: "GET",
    url: `dicom/dicom-series/${params.id}/`,
  });

export const getDicomSeriesMprDetail = async (params: { id: string }) =>
  await personalReq({
    method: "GET",
    url: `dicom/dicom-series/mpr/${params.id}/`,
  });

export const getDicomPicture = async (params: any) =>
  await personalReq({
    method: "GET",
    url: "/dicom/dicom-picture/",
    params,
  });

export const getDicomPictureDetail = async (params: any) =>
  await personalReq({
    method: "GET",
    url: `/dicom/dicom-picture/${params.id}/`,
    params,
  });

export const searchDicomInfo = async (params: any) =>
  await personalReq({
    method: "GET",
    url: "/dicom/search/",
    params,
  });

export const uploadDicomFile = async (data: any) =>
  await personalReq({
    method: "POST",
    url: "/dicom/upload/",
    data,
  });

export const searchDicomFile = async (params: any) =>
  await personalReq({
    method: "GET",
    url: "/dicom/dicom-file/",
    params,
  });

export const getDicomFileStats = async (params?: any) =>
  await personalReq({ method: "GET", url: "/dicom/dicom-stats/", params });

/**
 * @description 检查dicom解析进度并返回剩余解析量
 * @returns {Promise<number>}
 */
export const checkDicomParseProgress = async (): Promise<number> => {
  try {
    return (await personalReq({ method: "GET", url: "/dicom/parse-progress/" })).parsing as number;
    // const res = await personalApi.get("/dicom/parse-progress/");
    // return res.data.parsing as number;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * @description 检查dicom解析进度并返回所有上传的dicom计数
 * @returns {Promise<number>}
 */
export const checkDicomTotalCount = async (): Promise<number> => {
  try {
    return (
      await personalReq({
        method: "GET",
        url: "/dicom/parse-progress/",
      })
    ).total as number;
    // const res = await personalApi.get("/dicom/parse-progress/");
    // return res.data.total as number;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * 公共影像集统计
 *
 * @returns {Promise<any>}
 */
export const getPublicImageStats = async (): Promise<GalleryStatsI[]> => {
  try {
    return personalReq({
      method: "GET",
      url: "dicom/public-image/stats",
    });
    // const res = await personalApi.get("/dicom/public-image/stats/");
    // return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * 获取公共图像集合
 */
export const getPublicImages = async (): Promise<GalleryI[]> => {
  try {
    return await personalReq({ method: "GET", url: "/dicom/public-image/manage/" });
    // const res = await personalApi.get("/dicom/public-image/manage/");
    // return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * 上传公共图像
 * @param {FormData} data
 */
export const uploadPublicImage = async (data: FormData): Promise<GalleryI> => {
  try {
    return await personalReq({
      method: "POST",
      url: `/dicom/public-image/upload/`,
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * 更新公共图像
 * @param {string} id 目标图像id
 * @param {FormData} data
 */
export const updatePublicImage = async (id: string, data: FormData): Promise<GalleryI> => {
  try {
    return await personalReq({
      method: "POST",
      url: `dicom/public-image/${id}/`,
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * 更新公共图像
 * @param {string} id 目标图像id
 * @param {FormData} data
 */
export const delPublicImages = async (id: string[]): Promise<any> => {
  try {
    return await personalReq({
      method: "POST",
      url: "/dicom/public-image/del/",
      data: {
        id,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * 上传DICOM
 *
 * @param {FormData} data
 * @param {(progressEvent: ProgressEvent) => void} [onUploadProgress]
 * @returns {Promise<void>}
 */
export const uploadDicom = async (
  data: FormData,
  onUploadProgress?: (progressEvent: ProgressEvent) => void,
): Promise<void> => {
  await personalReq({
    method: "POST",
    url: "/dicom/upload/",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};
