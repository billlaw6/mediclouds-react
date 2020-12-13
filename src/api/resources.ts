import { personalReq, publicReq } from "_axios";
import { LungNoduleReportI } from "_types/ai";
import {
  GetSearchQueryPropsI,
  SearchQueryResI,
  SeriesI,
  SeriesListI,
  SeriesMprI,
} from "_types/api";
import { ExamIndexListI } from "_types/core";
import { ExamIndexI, ImgI, PdfI, ResourcesDelDataI, ResourcesTypeE } from "_types/resources";

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
): Promise<string[] | undefined> =>
  await publicReq({
    method: "POST",
    url: "/resources/upload/",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

/* 删除资源 */
export const delExamList = async (type: ResourcesTypeE, id: string[]): Promise<ResourcesDelDataI> =>
  await publicReq({
    method: "POST",
    url: `/resources/del/`,
    data: {
      [type]: id,
    },
  });

/* 获取检查列表 */
export const getExamList = async (
  id: string,
  searchQuery?: GetSearchQueryPropsI,
): Promise<SearchQueryResI<ExamIndexListI>> =>
  await publicReq({
    method: "POST",
    url: `/resources/exam-list/${id}/`,
    data: searchQuery,
  });

/** 获取某个检查的信息 */
export const getExam = async (id: string): Promise<ExamIndexI> =>
  await publicReq({
    method: "GET",
    url: `/resources/exam/${id}/`,
  });

/* 获取序列列表 */
export const getSeriesList = async (
  id: string, // exam id
): Promise<SeriesListI> =>
  await publicReq({
    method: "GET",
    url: `/resources/series-list/${id}/`,
  });

/* 获取单个series信息 */
export const getSeries = async (id: string): Promise<SeriesI> =>
  await personalReq({
    method: "GET",
    url: `/dicom/dicom-series/${id}/`,
  });

/* 获取肺窗单个series信息 */
export const getLungSeries = async (id: string): Promise<SeriesI> =>
  await personalReq({
    method: "GET",
    url: `/dicom/dicom-series/${id}/?lung_pictures=1`,
  });

/* 获取单个mpr series信息 */
export const getMprSeries = async (id: string): Promise<SeriesMprI> =>
  await personalReq({
    method: "GET",
    url: `/dicom/dicom-series/${id}/?mpr=1`,
  });

/* 获取pdf资源列表 */
export const getPdfList = async (
  id: string,
  searchQuery?: GetSearchQueryPropsI,
): Promise<SearchQueryResI<PdfI>> =>
  await publicReq({
    method: "POST",
    url: `/resources/pdf-list/${id}/`,
    data: searchQuery,
  });

/* 获取图片资源列表 */
export const getImgList = async (
  id: string,
  searchQuery?: GetSearchQueryPropsI,
): Promise<SearchQueryResI<ImgI>> =>
  await publicReq({
    method: "POST",
    url: `/resources/img-list/${id}/`,
    data: searchQuery,
  });

/* 获取肺结节筛查报告资源列表 */
export const getLungNodulesReportList = async (
  id: string,
  searchQuery?: GetSearchQueryPropsI,
): Promise<SearchQueryResI<LungNoduleReportI>> =>
  await publicReq({
    method: "POST",
    url: `/resources/lung-nodules-list/${id}/`,
    data: searchQuery,
  });

/* 更新exam的描述 */
export const updateExamDesc = async (id: string, desc: string): Promise<void> => {
  await personalReq({
    method: "POST",
    url: `/dicom/exam-index/${id}/`,
    data: { desc },
  });
};
