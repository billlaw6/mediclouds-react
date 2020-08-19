import { personalApi } from "_axios";

export const isIE = (): boolean => navigator.userAgent.indexOf("MSIE") > -1;

/**
 * @description 检查dicom解析进度并返回剩余解析量
 * @returns {Promise<number>}
 */
export const checkDicomParseProgress = async (): Promise<number> => {
  try {
    const res = await personalApi.get("/dicom/parse-progress/");
    return res.data.parsing as number;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * @description 检查dicom解析进度并返回所有上传的dicom计数
 * @returns {Promise<number>}
 */
export const checkDicomTotalCount = async (): Promise<number> => {
  try {
    const res = await personalApi.get("/dicom/parse-progress/");
    return res.data.total as number;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * 获取url内传递的参数
 * @return {object} params
 */
export const getQueryString = (): any => {
  const search = window.location.search.substring(1);
  const param: { [key: string]: any } = {};
  const arr = search.split("&");

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i].split("=");
    if (!item[0]) continue;
    param[item[0]] = decodeURIComponent(item[1]);
  }

  return param;
};

export default getQueryString;
