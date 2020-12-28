import { getExam, ExamI } from "mc-api";
import { PlayerExamPropsI } from "../types/common";

/** 获取指定的seriesList */
export default async (exams: PlayerExamPropsI[]): Promise<ExamI[]> => {
  const fetchArr: Promise<ExamI>[] = [];

  exams.forEach((examProps) => {
    fetchArr.push(getExam(examProps.id));
  });

  try {
    return await Promise.all(fetchArr);
  } catch (error) {
    throw new Error(error);
  }
};
