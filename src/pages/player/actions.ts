import axios from "_services/api";
import { SeriesListI, SeriesI, SeriesMprI } from "_constants/interface";

/* 获取series列表 */
export const getSeriesList = async (id: string): Promise<SeriesListI> => {
  const listRes = await axios.get(`/dicom/exam-index/${id}/`);
  return listRes.data;
};

/* 获取单个series信息 */
export const getSeries = async (id: string): Promise<SeriesI> => {
  const seriesRes = await axios.get(`/dicom/dicom-series/${id}/`);
  return seriesRes.data;
};

/* 获取单个mpr series信息 */
export const getMprSeries = async (id: string): Promise<SeriesMprI> => {
  const seriesRes = await axios.get(`/dicom/dicom-series/${id}/?mpr=1`);
  return seriesRes.data;
};
