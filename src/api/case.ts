import { personalReq, publicReq } from "_axios";
import { GetSearchQueryPropsI, SearchQueryResI } from "_types/api";
import { CaseI } from "_types/case";

// export const getMineCaseList = async (): Promise<SearchQueryResI<CaseI>> =>
//   await publicReq({
//     method: "GET",
//     url: "/case/list/",
//   });

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
