import { ViewTypeEnum } from "_pages/resources/type";
import * as types from "../action-types";
import {
  ExamSortKeyE,
  ImgAndPdfSortKeyE,
  ResourcesActionE,
  ResourcesTypeE,
} from "_types/resources";
import { ActionI } from "_types/core";

// 改变dicom list 显示模式
export type SetViewModeActionT = ActionI<string, ViewTypeEnum>;
export interface SetViewModeActionFuncI {
  (mode: ViewTypeEnum): SetViewModeActionT;
}
export const setViewModeAction: SetViewModeActionFuncI = (mode) => ({
  type: types.SET_VIEW_MODE,
  payload: mode,
});

// 改变资源排序规则
export interface SetViewSortByActionFuncI {
  (type: ResourcesTypeE, key: ExamSortKeyE | ImgAndPdfSortKeyE): ActionI<
    string,
    { [key: string]: ExamSortKeyE | ImgAndPdfSortKeyE }
  >;
}
export const SetViewSortByAction: SetViewSortByActionFuncI = (type, key) => ({
  type: types.SET_VIEW_SORY_BY,
  payload: { [type]: key },
});

export interface SwitchTabTypeActionFuncI {
  (type: ResourcesTypeE): ActionI<string, ResourcesTypeE>;
}
export const switchTabTypeAction: SwitchTabTypeActionFuncI = (type) => ({
  type: ResourcesActionE.SWITCH_RESOURCES_TYPE,
  payload: type,
});

interface DicomSettingsStateI {
  sortBy: {
    [ResourcesTypeE.EXAM]: ExamSortKeyE;
    [ResourcesTypeE.IMG]: ImgAndPdfSortKeyE;
    [ResourcesTypeE.PDF]: ImgAndPdfSortKeyE;
  };
  viewMode: ViewTypeEnum;
  tabType: ResourcesTypeE;
}

const defaultState: DicomSettingsStateI = {
  sortBy: {
    [ResourcesTypeE.EXAM]: ExamSortKeyE.STUDY_DATE,
    [ResourcesTypeE.IMG]: ImgAndPdfSortKeyE.CREATED_AT,
    [ResourcesTypeE.PDF]: ImgAndPdfSortKeyE.CREATED_AT,
  },
  viewMode: ViewTypeEnum.GRID,
  tabType: ResourcesTypeE.EXAM,
};

export default (
  state = defaultState,
  action: ReturnType<
    typeof setViewModeAction | typeof SetViewSortByAction | typeof switchTabTypeAction
  >,
): DicomSettingsStateI => {
  const { type, payload } = action;

  switch (type) {
    case ResourcesActionE.SET_VIEW_MODE:
    case types.SET_VIEW_MODE: {
      return Object.assign({}, state, { viewMode: payload });
    }
    case ResourcesActionE.SET_SORT_BY_KEY: {
      const res = Object.assign({}, state, { sortBy: Object.assign({}, state.sortBy, payload) });

      return res;
    }
    case ResourcesActionE.SWITCH_RESOURCES_TYPE: {
      const res = Object.assign({}, state, { tabType: payload || ResourcesTypeE.EXAM });

      return res;
    }
    default: {
      return state;
    }
  }
};
