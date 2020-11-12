import { personalReq } from "_axios";
import { SeriesListI } from "_types/api";

/* 获取series列表 */
export const getSeriesList = async (id: string): Promise<SeriesListI> =>
  await personalReq({
    method: "GET",
    url: `/dicom/exam-index/${id}/`,
  });
