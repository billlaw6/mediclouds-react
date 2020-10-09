import { ExamIndexI, ExamSortKeyE, ImgAndPdfSortKeyE } from "_types/resources";
import { ActionI, SearchFormI } from "_types/core";
import * as types from "../action-types";
import { ViewTypeEnum } from "_pages/resources/type";

// 用于在SAGA中触发请求
export type GetExamIndexListActionT = ActionI<string, SearchFormI>;
export interface GetExamIndexListActionFuncI {
  (payload: SearchFormI): GetExamIndexListActionT;
}
export const getExamIndexListAction: GetExamIndexListActionFuncI = (payload) => ({
  type: types.GET_EXAM_INDEX_LIST,
  payload,
});

// 用于saga监听，发起远程删除请求，更新本地数据
export type DeleteExamIndexListActionT = ActionI<string, string[]>;
export interface DeleteExamIndexListActionFuncI {
  (payload: string[]): DeleteExamIndexListActionT;
}
export const deleteExamIndexListAction: DeleteExamIndexListActionFuncI = (payload) => ({
  type: types.DELETE_EXAM_INDEX_LIST,
  payload,
});

// 设置本地影像列表全局变量
export type SetExamIndexListActionT = ActionI<string, ExamIndexI[]>;
export interface SetExamIndexListActionFuncI {
  (payload: ExamIndexI[]): SetExamIndexListActionT;
}
export const setExamIndexListAction: SetExamIndexListActionFuncI = (payload) => ({
  type: types.SET_EXAM_INDEX_LIST,
  payload,
});

// 改变dicom list 显示模式
export type SetViewModeActionT = ActionI<string, ViewTypeEnum>;
export interface SetViewModeActionFuncI {
  (mode: ViewTypeEnum): SetViewModeActionT;
}
export const setViewModeAction: SetViewModeActionFuncI = (mode) => ({
  type: types.SET_VIEW_MODE,
  payload: mode,
});

// 改变dicom list 排序
export interface SetViewSortByActionFuncI {
  (mode: ExamSortKeyE | ImgAndPdfSortKeyE): ActionI<string, ExamSortKeyE | ImgAndPdfSortKeyE>;
}
export const SetViewSortByAction: SetViewSortByActionFuncI = (sortBy) => ({
  type: types.SET_VIEW_SORY_BY,
  payload: sortBy,
});

// export const getDicomSeriesMprAction = (payload: string) => ({
//   type: types.GET_DICOM_SERIES_MPR,
//   payload,
// });

// export const setDicomSeriesMprAction = (payload: DicomSeriesI[]) => ({
//   type: types.SET_DICOM_SERIES_MPR,
//   payload,
// });

// export const getDicomSeriesAction = (payload: string) => ({
//   type: types.GET_DICOM_SERIES,
//   payload,
// });

// export const setDicomSeriesAction = (payload: DicomSeriesI[]) => ({
//   type: types.SET_DICOM_SERIES,
//   payload,
// });

// export const getDicomPicturesAction = (payload: string) => ({
//   type: types.GET_DICOM_PICTURES,
//   payload,
// });

// export const setDicomPicturesAction = (payload: DicomPictureI[]) => ({
//   type: types.SET_DICOM_PICTURES,
//   payload,
// });
