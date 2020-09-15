import { ExamIndexListI } from "_types/core";
import { ResourcesActionE } from "_types/resources";

export const getExamList = (payload: ExamIndexListI[]) => ({
  type: ResourcesActionE.GET_EXAM_LIST,
  payload,
});
