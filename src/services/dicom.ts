import axios from "./api";
import { GalleryI, GalleryStatsI } from "_constants/interface";

export const getExamIndex = async (params: any) => {
  const res = await axios.get(`/dicom/exam-index/`, { params: params });
  return res;
};

export const deleteExamIndex = async (params: string[]) => {
  const res = await axios.post(`/dicom/exam-index/del/`, { id: params });
  return res;
};

export const getExamIndexDetail = async (params: any) => {
  const res = await axios.get(`/dicom/exam-index/${params.id}/`, { params: params });
  return res;
};

export const getDicomSeries = async (params: any) => {
  const res = await axios.get(`/dicom/dicom-series/`, { params: params });
  return res;
};

export const getDicomSeriesDetail = async (params: any) => {
  const res = await axios.get(`/dicom/dicom-series/${params.id}/`);
  return res;
};

export const getDicomSeriesMprDetail = async (params: { id: string }) => {
  const res = await axios.get(`/dicom/dicom-series/mpr/${params.id}/`);
  return res;
};

export const getDicomPicture = async (params: any) => {
  const res = await axios.get(`/dicom/dicom-picture/`, { params: params });
  return res;
};

export const getDicomPictureDetail = async (params: any) => {
  const res = await axios.get(`/dicom/dicom-picture/${params.id}/`, { params: params });
  return res;
};

export const searchDicomInfo = async (params: any) => {
  const res = await axios.get(`/dicom/search/`, { params: params });
  return res;
};

export const uploadDicomFile = async (params: any) => {
  const res = await axios.post(`/dicom/upload/`, params);
  return res;
};

export const searchDicomFile = async (params: any) => {
  const res = await axios.get(`/dicom/dicom-file/`, { params: params });
  return res;
};

export const getDicomFileStats = async (params: any) => {
  const res = await axios.get(`/dicom/dicom-stats/`, { params: params });
  return res;
};

/**
 * @description 检查dicom解析进度并返回剩余解析量
 * @returns {Promise<number>}
 */
export const checkDicomParseProgress = async (): Promise<number> => {
  try {
    const res = await axios.get("/dicom/parse-progress/");
    return res.data.parsing as number;
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
    const res = await axios.get("/dicom/parse-progress/");
    return res.data.total as number;
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
    const res = await axios.get("/dicom/public-image/stats/");
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * 获取公共图像集合
 */
export const getPublicImages = async (): Promise<GalleryI[]> => {
  try {
    const res = await axios.get("/dicom/public-image/manage/");
    return res.data;
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
    return await axios.post("/dicom/public-image/upload/", data, {
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
    return await axios.post(`/dicom/public-image/${id}/`, data, {
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
    return await axios.post(`/dicom/public-image/del/`, {
      id,
    });
  } catch (error) {
    throw new Error(error);
  }
};
