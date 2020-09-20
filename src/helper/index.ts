import { personalReq } from "_axios";
import { ReactNode } from "react";
import { GetSearchQueryPropsI } from "_types/api";
import CryptoJS from "crypto-js";
import { type } from "os";

export const isArray = (arr: any): boolean => Array.isArray(arr);
export const isUndefined = (val: any): boolean => typeof val === "undefined";
export const isNull = (val: any): boolean =>
  Object.prototype.toString.call(val) === "[object Null]";

export const isIE = (): boolean => navigator.userAgent.indexOf("MSIE") > -1;

/* 加密 */
export const encrypt = (val: any, secret = "FreMaNgo_&_Mediclouds"): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(val), secret).toString();
};

/* 解密 */
export const decrypt = (str: string, secret = "FreMaNgo_&_Mediclouds"): any => {
  const bytes = CryptoJS.AES.decrypt(str, secret);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  const res = JSON.parse(decrypted);
  return res;
};

/**
 * @description 检查dicom解析进度并返回剩余解析量
 * @returns {Promise<number>}
 */
export const checkDicomParseProgress = async (): Promise<number> => {
  try {
    const res = await personalReq({
      method: "GET",
      url: "/dicom/parse-progress/",
    });

    return res.parsing as number;
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
    const res = await personalReq({
      method: "GET",
      url: "/dicom/parse-progress/",
    });
    return res.total as number;
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

/**
 * 清除token
 */
export const clearToken = (): void => {
  window.localStorage.removeItem("token");
};

/**
 * 设置token
 * @param {string} token
 */
export const setToken = (token: string): void => {
  if (!token) return;
  window.localStorage.setItem("token", encrypt(`Token ${token}`, "FreMaNgo_^_T"));
};

/**
 * 获取token
 */
export const getToken = (): string => {
  const tokenStr = window.localStorage.getItem("token") || "";
  if (!tokenStr) return "";
  return decrypt(tokenStr, "FreMaNgo_^_T");
};

/**
 *  获取查询条件拼接字符串
 *
 * @param {GetSearchQueryPropsI} props
 */
export const getSearchQuery = (props?: GetSearchQueryPropsI): string => {
  if (!props) return "";

  const {
    id = "",
    current = 1,
    size = 12,
    start = "",
    end = "",
    sort = "",
    keyword = "",
    ascend = "",
  } = props;
  return `id=${id}&current=${current}&size=${size}&start=${encodeURI(start)}&end=${encodeURI(
    end,
  )}&sort=${sort}&keyword=${keyword}&ascend=${ascend}`;
};

export interface MatchRuleI {
  key: string | string[];
  level: number; // 级别 升序
  content: ReactNode | string;
}

export interface MatchSwitchRuleI<T = any> {
  key: string;
  content: T;
}

interface MatchRuleResI {
  key: string;
  content: (ReactNode | string)[] | { order: number; value: ReactNode | string }[];
}

interface MatchRuleFunI {
  (rules: MatchRuleI[], key?: string): MatchRuleResI[] | (ReactNode | string);
}

interface MatchSwitchRulFunI {
  <T = any>(rules: MatchSwitchRuleI<T>[], key?: string): T | undefined;
}

/**
 * 依据规则匹配相应的内容 level更大的包含level小的content
 *
 * @param {MathRuleI[]} rules 规则
 * @param {string} key 输出指定的key的content
 *
 * 例如 rules为 [
 *  {key: RoleE.BUSINESS, level: 3, content: "Hello"},
 *  {key: RoleE.SUPER_ADMIN, level: 5, content: "world"},
 * ]
 *
 * 则输出为 [
 *  {key: RoleE.BUSINESS, content: ["Hello"]},
 *  {key: RoleE.SUPER_ADMIN, content: ["Hello", "world"]},
 * ]
 *
 * 如果有指定key， 则输出此key的content
 */

export const matchRules: MatchRuleFunI = (rules, key) => {
  const _rules = rules.sort((a, b) => a.level - b.level);
  const res: MatchRuleResI[] = [];
  const contentArr: (ReactNode | string)[] = [];

  _rules.forEach((item) => {
    contentArr.push(item.content);
    if (isArray(item.key)) {
      (item.key as string[]).forEach((keyItem) =>
        res.push({ key: keyItem, content: [...contentArr] }),
      );
    } else {
      res.push({ key: item.key as string, content: [...contentArr] });
    }
  });

  if (key) return res.filter((item) => item.key === key)[0].content;

  return res;
};
/**
 * 依据规则匹配相应内容 返回相匹配的内容
 *
 * @param {*} rules
 * @param {*} key
 * @returns
 */
export const matchSwitchRules: MatchSwitchRulFunI = (rules, key) => {
  const res = rules.filter((item) => item.key === key)[0];

  if (!res) return;
  return res.content;
};

/**
 * 转换 图片文件 到 base64
 *
 * @param {File} image
 * @returns {Promise<string>}
 */
export const ImageFileToBase64 = (image: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e): void => {
      if (e.target) resolve(e.target.result as string);
      else reject("not found target");
    };
    reader.onerror = (err): void => reject(err);

    reader.readAsDataURL(image);
  });
};
