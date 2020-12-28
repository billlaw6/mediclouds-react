import { ExamSortKeyE, ImgAndPdfSortKeyE, ResourcesTypeE, CaseTypeE } from "mc-api";
import { ActionI } from "_types/core";
import { CaseActionE } from "_types/case";
import { ResourcesActionE } from "_types/resources";

interface SettingsStateI {
  resourcesSortBy: {
    [key: string]: any;
    [ResourcesTypeE.EXAM]: ExamSortKeyE;
    [ResourcesTypeE.IMG]: ImgAndPdfSortKeyE;
    [ResourcesTypeE.PDF]: ImgAndPdfSortKeyE;
  };
  resourcesTabType: ResourcesTypeE;
  caseTabType: CaseTypeE;
}

const defaultState: SettingsStateI = {
  resourcesSortBy: {
    [ResourcesTypeE.EXAM]: ExamSortKeyE.STUDY_DATE,
    [ResourcesTypeE.IMG]: ImgAndPdfSortKeyE.CREATED_AT,
    [ResourcesTypeE.PDF]: ImgAndPdfSortKeyE.CREATED_AT,
  },
  resourcesTabType: ResourcesTypeE.EXAM,
  caseTabType: CaseTypeE.MINE,
};

export default (
  state = defaultState,
  action: ActionI<ResourcesActionE | CaseActionE, any>,
): SettingsStateI => {
  const { type, payload } = action;

  switch (type) {
    case ResourcesActionE.SET_SORT_BY_KEY: {
      const res = Object.assign({}, state, {
        resourcesSortBy: Object.assign({}, state.resourcesSortBy, payload),
      });

      return res;
    }
    case CaseActionE.SWITCH_CASE_TAB_TYPE: {
      const res = Object.assign({}, state, { caseTabType: payload || CaseTypeE.MINE });

      return res;
    }
    case ResourcesActionE.SWITCH_RESOURCES_TYPE: {
      const res = Object.assign({}, state, { resourcesTabType: payload || ResourcesTypeE.EXAM });

      return res;
    }
    default: {
      return state;
    }
  }
};
