import { ExamIndexI } from "_constants/interface";
import * as types from "../action-types";
import { setExamIndexListAction } from "_actions/dicom";

// 全局变量examIndexList
const defaultExamIndexList: ExamIndexI[] = [];
const examIndexListReducer = (
  state = defaultExamIndexList,
  action: ReturnType<typeof setExamIndexListAction>,
): ExamIndexI[] => {
  if (!action) return state;
  switch (action.type) {
    // 全部CASE必须返回STATE类型的数据，以替换原来的STATE。actions文件中已经指定了payload的类型。
    case types.SET_EXAM_INDEX_LIST:
      return action.payload;
    default: {
      return state;
    }
  }
};

// const defaultDicomPictures: DicomPictureI[] = [];
// const dicomPicturesReducer = (
//   state = defaultDicomPictures,
//   action: ReturnType<typeof setDicomPicturesAction>,
// ) => {
//   if (!action) return state;
//   switch (action.type) {
//     // 全部CASE必须返回STATE类型的数据，以替换原来的STATE。actions文件中已经指定了payload的类型。
//     case types.SET_DICOM_PICTURES:
//       return action.payload;
//     default: {
//       return state;
//     }
//   }
// };

// const defaultDicomSeries: DicomSeriesI[] = [];
// const dicomSeriesReducer = (
//   state = defaultDicomSeries,
//   action: ReturnType<typeof setDicomSeriesAction>,
// ) => {
//   if (!action) return state;
//   switch (action.type) {
//     // 全部CASE必须返回STATE类型的数据，以替换原来的STATE。actions文件中已经指定了payload的类型。
//     case types.SET_DICOM_SERIES:
//       return action.payload;
//     default: {
//       return state;
//     }
//   }
// };

export { examIndexListReducer };
