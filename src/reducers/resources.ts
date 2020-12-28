import { ExamListItemI, ImgI, PdfI, LungNoduleReportI, SearchQueryResI } from "mc-api";
import { Reducer } from "redux";
import { ActionI } from "_types/core";
import { ResourcesActionE } from "_types/resources";

interface ResourcesStateI {
  examList?: SearchQueryResI<ExamListItemI>;
  imgList?: SearchQueryResI<ImgI>;
  pdfList?: SearchQueryResI<PdfI>;
  lungNodulesReportList?: SearchQueryResI<LungNoduleReportI>;
}

const resources: Reducer<ResourcesStateI, ActionI<ResourcesActionE, any>> = (
  state = {},
  actions,
) => {
  const { type, payload } = actions;

  switch (type) {
    case ResourcesActionE.GET_EXAM_LIST: {
      if (payload) return Object.assign({}, state, { examList: payload });
      else return state;
    }
    case ResourcesActionE.GET_IMG_LIST: {
      if (payload) return Object.assign({}, state, { imgList: payload });
      else return state;
    }
    case ResourcesActionE.GET_PDF_LIST: {
      if (payload) return Object.assign({}, state, { pdfList: payload });
      else return state;
    }
    case ResourcesActionE.GET_LUNG_NODULES_REPORT: {
      if (payload) return Object.assign({}, state, { lungNodulesReportList: payload });
      else return state;
    }
    default:
      return state;
  }
};

export default resources;
