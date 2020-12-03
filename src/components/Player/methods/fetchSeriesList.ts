import { getDicomSeries } from "_api/dicom";
import { SeriesListI } from "_types/api";
import { PlayerExamPropsI } from "../types";

/** 获取指定的seriesList */
export default async (exams: PlayerExamPropsI[]): Promise<SeriesListI[]> => {
  const fetchArr: Promise<SeriesListI>[] = [];
  exams.forEach((examProps) => {
    fetchArr.push(getDicomSeries(examProps.id));
  });

  try {
    return await Promise.all(fetchArr);
  } catch (error) {
    throw new Error(error);
  }
};
