import { stat } from "fs";
import { useDispatch, useSelector } from "react-redux";
import { getLungNoduleReport } from "_api/ai";
import { deleteExamIndex } from "_api/dicom";
import {
  delExamList,
  getExamList,
  getImgList,
  getLungNodulesReportList,
  getPdfList,
  updateExamDesc,
} from "_api/resources";
import { ViewTypeEnum } from "_pages/resources/type";
import { GetSearchQueryPropsI } from "_types/api";
import { StoreStateI } from "_types/core";
import {
  ExamSortKeyE,
  ImgAndPdfSortKeyE,
  ResourcesActionE,
  ResourcesTypeE,
} from "_types/resources";
import useAccount from "./useAccount";

export default () => {
  const { account } = useAccount();
  const dispatch = useDispatch();
  const {
    examList,
    pdfList,
    imgList,
    lungNodulesReportList,
    sortBy,
    viewMode,
    tabType,
  } = useSelector<StoreStateI, StoreStateI["resources"] & StoreStateI["resourcesSettings"]>(
    (state) => ({ ...state.resources, ...state.resourcesSettings }),
  );

  const { id = "" } = account;

  const fetchExamList = async (searchQuery?: GetSearchQueryPropsI): Promise<void> => {
    const res = await getExamList(id, searchQuery);
    dispatch({ type: ResourcesActionE.GET_EXAM_LIST, payload: res });
  };

  const fetchImgList = async (searchQuery?: GetSearchQueryPropsI): Promise<void> => {
    const res = await getImgList(id, searchQuery);
    dispatch({ type: ResourcesActionE.GET_IMG_LIST, payload: res });
  };

  const fetchPdfList = async (searchQuery?: GetSearchQueryPropsI): Promise<void> => {
    const res = await getPdfList(id, searchQuery);
    dispatch({ type: ResourcesActionE.GET_PDF_LIST, payload: res });
  };

  const fetchLungNodulesReportList = async (searchQuery?: GetSearchQueryPropsI): Promise<void> => {
    const res = await getLungNodulesReportList(id, searchQuery);
    dispatch({ type: ResourcesActionE.GET_LUNG_NODULES_REPORT, payload: res });
  };

  const changeViewMode = (type: ViewTypeEnum): void => {
    dispatch({ type: ResourcesActionE.SET_VIEW_MODE, payload: type });
  };

  const changeSortBy = (type: ResourcesTypeE, sortKey: ExamSortKeyE | ImgAndPdfSortKeyE): void => {
    dispatch({ type: ResourcesActionE.SET_SORT_BY_KEY, payload: { [type]: sortKey } });
  };

  /* 删除exam */
  const delExam = async (ids: string[]): Promise<void> => {
    const res = await delExamList(ResourcesTypeE.EXAM, ids);
    dispatch({ type: ResourcesActionE.DEL_EXAM_LIST, payload: res });
  };

  /* 删除pdf */
  const delPdf = async (ids: string[]): Promise<void> => {
    const res = await delExamList(ResourcesTypeE.PDF, ids);
    dispatch({ type: ResourcesActionE.DEL_PDF_LIST, payload: res });
  };

  /* 删除图片 */
  const delImg = async (ids: string[]): Promise<void> => {
    const res = await delExamList(ResourcesTypeE.IMG, ids);
    dispatch({ type: ResourcesActionE.DEL_IMG_LIST, payload: res });
  };

  /* 删除肺结节筛查报告 */
  const delLungNodulesReport = async (ids: string[]): Promise<void> => {
    const res = await delExamList(ResourcesTypeE.LUNG_NODULES_REPORT, ids);
    dispatch({ type: ResourcesActionE.DEL_LUNG_NODULES_REPORT, payload: res });
  };

  const _updateExamDesc = async (id: string, desc: string): Promise<void> => {
    await updateExamDesc(id, desc);
  };

  /* 切换tabType 配置 */
  const switchTabType = (type: ResourcesTypeE): void => {
    dispatch({ type: ResourcesActionE.SWITCH_RESOURCES_TYPE, payload: type });
  };

  return {
    examList,
    pdfList,
    imgList,
    lungNodulesReportList,
    sortBy,
    viewMode,
    tabType,
    fetchExamList,
    delExam,
    fetchImgList,
    delImg,
    fetchPdfList,
    delPdf,
    fetchLungNodulesReportList,
    delLungNodulesReport,
    changeViewMode,
    changeSortBy,
    updateExamDesc: _updateExamDesc,
    switchTabType,
  };
};
