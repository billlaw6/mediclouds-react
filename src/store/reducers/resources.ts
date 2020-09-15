import { Reducer } from "redux";
import { ActionI, ExamIndexListI } from "_types/core";
import { ResourcesActionE } from "_types/resources";

interface ResourcesStateI {
  dicom?: ExamIndexListI[];
}

const resources: Reducer<ResourcesStateI, ActionI<ResourcesActionE, any>> = (
  state = {},
  actions,
) => {
  const { type, payload } = actions;

  console.log("action", actions);

  switch (type) {
    case ResourcesActionE.GET_EXAM_LIST: {
      if (payload) return Object.assign({}, state, { dicom: payload });
      else return state;
    }
    default:
      return state;
  }
};

export default resources;
