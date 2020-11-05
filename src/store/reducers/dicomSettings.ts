import { ViewTypeEnum } from "_pages/resources/type";
import {
  ExamSortKeyE,
  ImgAndPdfSortKeyE,
  ResourcesActionE,
  ResourcesTypeE,
} from "_types/resources";
import { ActionI } from "_types/core";

interface ResourcesSettingsStateI {
  sortBy: {
    [key: string]: any;
    [ResourcesTypeE.EXAM]: ExamSortKeyE;
    [ResourcesTypeE.IMG]: ImgAndPdfSortKeyE;
    [ResourcesTypeE.PDF]: ImgAndPdfSortKeyE;
  };
  viewMode: ViewTypeEnum;
  tabType: ResourcesTypeE;
}

interface ActionPayloadI {
  sortBy?: {
    [key: string]: any;
    [ResourcesTypeE.EXAM]?: ExamSortKeyE;
    [ResourcesTypeE.IMG]?: ImgAndPdfSortKeyE;
    [ResourcesTypeE.PDF]?: ImgAndPdfSortKeyE;
  };
  viewMode?: ViewTypeEnum;
  tabType?: ResourcesTypeE;
}

const defaultState: ResourcesSettingsStateI = {
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
  action: ActionI<ResourcesActionE, ActionPayloadI>,
): ResourcesSettingsStateI => {
  const { type, payload } = action;

  switch (type) {
    case ResourcesActionE.SET_VIEW_MODE: {
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
