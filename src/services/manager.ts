import axios from "./api";

/* 获取首页封面图集 */
export const getHomeResList = async () => await axios.get("/dicom/home-resource/");

/* 创建新的封面图 */
export const createHomeResList = async (data: FormData) =>
  await axios.post("/dicom/home-resource/", data);

/* 更新封面图 */
export const updateHomeResList = async (id: string, data: FormData) =>
  await axios.post(`/dicom/home-resource/${id}/`, data);

/* 删除封面图 */
export const delHomeResList = async (ids: string[]) =>
  await axios.post(`/dicom/home-resource/del/`, {
    id: ids,
  });
