import { getSeriesList, SeriesListI } from "mc-api";
import { PlayerExamPropsI } from "../types/common";

/** 获取指定的seriesList */
export default async (exams: PlayerExamPropsI[]): Promise<SeriesListI[]> => {
  const fetchArr: Promise<SeriesListI>[] = [];
  exams.forEach((examProps) => {
    fetchArr.push(getSeriesList(examProps.id));
  });

  try {
    return await Promise.all(fetchArr);
  } catch (error) {
    throw new Error(error);
  }
};
