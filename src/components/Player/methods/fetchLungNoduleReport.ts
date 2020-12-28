import { getLungNoduleReport, LungNoduleReportI } from "mc-api";
import { PlayerExamPropsI } from "../types/common";

/** 获取指定的报告Map */
export default async (exams: PlayerExamPropsI[]): Promise<Map<number, LungNoduleReportI>> => {
  const fetchArr: Promise<LungNoduleReportI>[] = [];
  exams.forEach((examProps) => {
    fetchArr.push(getLungNoduleReport(examProps.id));
  });

  try {
    const resMap = new Map();
    (await Promise.allSettled(fetchArr)).forEach((item, index) => {
      if (item.status === "fulfilled") {
        resMap.set(index, item.value);
      }
    });

    return resMap;
  } catch (error) {
    throw new Error(error);
  }
};
