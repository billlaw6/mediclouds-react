import { personalReq } from "_axios";

/* 获取首页封面图集 */
export const getHomeResList = async () =>
  await personalReq({
    method: "GET",
    url: "/dicom/home-resource/",
  });

/* 创建新的封面图 */
export const createHomeResList = async (data: FormData) =>
  await personalReq({
    method: "POST",
    url: "/dicom/home-resource/",
    data,
  });

/* 更新封面图 */
export const updateHomeResList = async (id: string, data: FormData) =>
  await personalReq({
    method: "POST",
    url: `/dicom/home-resource/${id}/`,
    data,
  });

/* 删除封面图 */
export const delHomeResList = async (id: string[]) =>
  await personalReq({
    method: "POST",
    url: "/dicom/home-resource/del/",
    data: {
      id,
    },
  });
