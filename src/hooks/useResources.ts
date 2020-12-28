import { useDispatch, useSelector } from "react-redux";
import { StoreStateI } from "_types/core";
import { ResourcesActionE } from "_types/resources";
import useAccount from "./useAccount";
import {
  getExamList,
  getImgList,
  getPdfList,
  getLungNodulesReportList,
  updateExamDesc,
  delResources,
  SearchQueryPropsI,
  ResourcesTypeE,
  ExamSortKeyE,
  ImgAndPdfSortKeyE,
} from "mc-api";

export default () => {
  const { account } = useAccount();
  const dispatch = useDispatch();
  const {
    examList,
    pdfList,
    imgList,
    lungNodulesReportList,
    resourcesSortBy,
    resourcesTabType,
  } = useSelector<StoreStateI, StoreStateI["resources"] & StoreStateI["settings"]>((state) => ({
    ...state.resources,
    ...state.settings,
  }));

  const { id = "" } = account;

  const fetchExamList = async (searchQuery?: SearchQueryPropsI): Promise<void> => {
    const res = await getExamList(id, searchQuery);
    dispatch({ type: ResourcesActionE.GET_EXAM_LIST, payload: res });
  };

  const fetchImgList = async (searchQuery?: SearchQueryPropsI): Promise<void> => {
    const res = await getImgList(id, searchQuery);
    dispatch({ type: ResourcesActionE.GET_IMG_LIST, payload: res });
  };

  const fetchPdfList = async (searchQuery?: SearchQueryPropsI): Promise<void> => {
    const res = await getPdfList(id, searchQuery);
    dispatch({ type: ResourcesActionE.GET_PDF_LIST, payload: res });
  };

  const fetchLungNodulesReportList = async (searchQuery?: SearchQueryPropsI): Promise<void> => {
    const res = await getLungNodulesReportList(id, searchQuery);
    dispatch({ type: ResourcesActionE.GET_LUNG_NODULES_REPORT, payload: res });
  };

  /** 切换排序 */
  const changeSortBy = (type: ResourcesTypeE, sortKey: ExamSortKeyE | ImgAndPdfSortKeyE): void => {
    dispatch({ type: ResourcesActionE.SET_SORT_BY_KEY, payload: { [type]: sortKey } });
  };

  /* 删除exam */
  const delExam = async (ids: string[]): Promise<void> => {
    const res = await delResources(ResourcesTypeE.EXAM, ids);
    dispatch({ type: ResourcesActionE.DEL_EXAM_LIST, payload: res });
  };

  /* 删除pdf */
  const delPdf = async (ids: string[]): Promise<void> => {
    const res = await delResources(ResourcesTypeE.PDF, ids);
    dispatch({ type: ResourcesActionE.DEL_PDF_LIST, payload: res });
  };

  /* 删除图片 */
  const delImg = async (ids: string[]): Promise<void> => {
    const res = await delResources(ResourcesTypeE.IMG, ids);
    dispatch({ type: ResourcesActionE.DEL_IMG_LIST, payload: res });
  };

  /* 删除肺结节筛查报告 */
  const delLungNodulesReport = async (ids: string[]): Promise<void> => {
    const res = await delResources(ResourcesTypeE.LUNG_NODULES_REPORT, ids);
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
    resourcesSortBy,
    resourcesTabType,
    fetchExamList,
    delExam,
    fetchImgList,
    delImg,
    fetchPdfList,
    delPdf,
    fetchLungNodulesReportList,
    delLungNodulesReport,
    changeSortBy,
    updateExamDesc: _updateExamDesc,
    switchTabType,
  };
};
