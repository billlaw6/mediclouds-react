import { Reducer } from "redux";
import { AiReportActionE, AiReportPayloadT, AiReportStateI, LungNoduleReportI } from "_types/ai";
import { ActionI } from "_types/core";

const DEFAULT_STATE: AiReportStateI = {
  lungNodule: undefined,
};

const aiReport: Reducer<
  AiReportStateI,
  ActionI<AiReportActionE, AiReportPayloadT<LungNoduleReportI>>
> = (state = DEFAULT_STATE, action): AiReportStateI => {
  const { type, payload } = action;

  switch (type) {
    case AiReportActionE.UPDATE_LUNG_NODULE:
      return Object.assign({}, state, { lungNodule: payload });
    default:
      return state;
  }
};

export default aiReport;
