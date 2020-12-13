import { getDicomSeries } from "_api/dicom";
import { getExam } from "_api/resources";
import { ExamIndexI } from "_types/resources";
import { PlayerExamPropsI } from "../types/common";

/** 获取指定的seriesList */
export default async (exams: PlayerExamPropsI[]): Promise<ExamIndexI[]> => {
  const fetchArr: Promise<ExamIndexI>[] = [];
  exams.forEach((examProps) => {
    fetchArr.push(getExam(examProps.id));
  });

  try {
    return await Promise.all(fetchArr);
  } catch (error) {
    throw new Error(error);
  }
};
