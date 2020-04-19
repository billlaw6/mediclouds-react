import { SortTypeEnum, ViewTypeEnum } from "_pages/home/type";
import { setViewModeAction, SetViewSortByAction } from "_actions/dicom";
import * as types from "../action-types";

interface DicomSettingsStateI {
  sortBy: SortTypeEnum;
  viewMode: ViewTypeEnum;
}

const defaultState: DicomSettingsStateI = {
  sortBy: SortTypeEnum.TIME,
  viewMode: ViewTypeEnum.GRID,
};

export default (
  state = defaultState,
  action: ReturnType<typeof setViewModeAction | typeof SetViewSortByAction>,
): DicomSettingsStateI => {
  const { type, payload } = action;

  switch (type) {
    case types.SET_VIEW_MODE: {
      return Object.assign({}, state, { viewMode: payload });
    }
    case types.SET_VIEW_SORY_BY: {
      return Object.assign({}, state, { sortBy: payload });
    }
    default: {
      return state;
    }
  }
};
