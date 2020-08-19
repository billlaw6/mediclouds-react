import { personalApi } from "_axios";

/* 获取首页封面图集 */
export const getHomeResList = async () => await personalApi.get("/dicom/home-resource/");

/* 创建新的封面图 */
export const createHomeResList = async (data: FormData) =>
  await personalApi.post("/dicom/home-resource/", data);

/* 更新封面图 */
export const updateHomeResList = async (id: string, data: FormData) =>
  await personalApi.post(`/dicom/home-resource/${id}/`, data);

/* 删除封面图 */
export const delHomeResList = async (ids: string[]) =>
  await personalApi.post(`/dicom/home-resource/del/`, {
    id: ids,
  });
