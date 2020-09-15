import { personalReq } from "_axios";
import { SeriesListI, SeriesI, SeriesMprI } from "_types/api";

/* 获取series列表 */
export const getSeriesList = async (id: string): Promise<SeriesListI> =>
  await personalReq({
    method: "GET",
    url: `/dicom/exam-index/${id}/`,
  });

/* 获取单个series信息 */
export const getSeries = async (id: string): Promise<SeriesI> =>
  await personalReq({
    method: "GET",
    url: `/dicom/dicom-series/${id}/`,
  });

/* 获取单个mpr series信息 */
export const getMprSeries = async (id: string): Promise<SeriesMprI> =>
  await personalReq({
    method: "GET",
    url: `/dicom/dicom-series/${id}/?mpr=1`,
  });
