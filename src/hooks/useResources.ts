import { stat } from "fs";
import { useDispatch, useSelector } from "react-redux";
import { deleteExamIndex } from "_api/dicom";
import { delExamList, getExamList, getImgList, getPdfList, updateExamDesc } from "_api/resources";
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
  const { examList, pdfList, imgList, sortBy, viewMode } = useSelector<
    StoreStateI,
    StoreStateI["resources"] & StoreStateI["resourcesSettings"]
  >((state) => ({ ...state.resources, ...state.resourcesSettings }));

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

  const _updateExamDesc = async (id: string, desc: string): Promise<void> => {
    await updateExamDesc(id, desc);
  };

  return {
    examList,
    pdfList,
    imgList,
    sortBy,
    viewMode,
    fetchExamList,
    delExam,
    fetchImgList,
    delImg,
    fetchPdfList,
    delPdf,
    changeViewMode,
    changeSortBy,
    updateExamDesc: _updateExamDesc,
  };
};
