import axios from "_services/api";

export const isIE = (): boolean => navigator.userAgent.indexOf("MSIE") > -1;

/**
 * @description 检查dicom解析进度并返回剩余解析量
 * @returns {Promise<number>}
 */
export const checkDicomParseProgress = async (): Promise<number> => {
  try {
    const res = await axios.get("/dicom/parse-progress");
    return res.data.parsing as number;
  } catch (error) {
    throw new Error(error);
  }
};
