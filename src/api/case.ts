import { personalReq, publicReq } from "_axios";
import { GetSearchQueryPropsI, SearchQueryResI } from "_types/api";
import { CaseActionE, CaseI, CreateCaseDataI } from "_types/case";

// export const getMineCaseList = async (): Promise<SearchQueryResI<CaseI>> =>
//   await publicReq({
//     method: "GET",
//     url: "/case/list/",
//   });

/* 新建病例 */
export const createCase = async (info: CreateCaseDataI): Promise<CaseI> =>
  await personalReq({
    url: "/dicom/case/",
    method: "POST",
    data: info,
  });

/** 获取病例列表 */
export const getMineCaseList = async (): Promise<CaseI[]> =>
  await personalReq({
    method: "GET",
    url: "/dicom/case/",
  });

/** 获取某个病例 */
export const getCase = async (id: string): Promise<CaseI> =>
  await personalReq({
    method: "GET",
    url: `/dicom/case/${id}`,
  });

/** 获取已读取过别人分享的病例列表 */
export const getSharedCaseList = async (): Promise<CaseI[]> =>
  await personalReq({
    method: "POST",
    url: `/dicom/case/shared/`,
  });

/* 上传生成的分享时间戳 */
export const updateCaseStamp = async (stamp: number, caseId: string): Promise<void> =>
  await personalReq({
    method: "POST",
    url: "/dicom/case-read-record/stamp/",
    data: { stamp, caseId },
  });

/** 删除病例 */
export const delCase = async (ids: number[]): Promise<number[]> =>
  await personalReq({
    method: "POST",
    url: "/dicom/case/del/",
    data: {
      id: ids,
    },
  });
