import { personalApi } from "_axios";
import { ReactNode } from "react";
import { isArray } from "util";
import { GetSearchQueryPropsI } from "_types/api";

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

/**
 * 设置token
 * @param {string} token
 */
export const setToken = (token: string): void =>
  window.localStorage.setItem("token", `Token ${token}`);

/**
 * 获取token
 */
export const getToken = (): string => window.localStorage.getItem("token") || "";

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
  level: number;
  content: ReactNode | string;
}

export interface MatchSwitchRuleI<T = any> {
  key: string;
  content: T;
}

interface MatchRuleResI {
  key: string;
  content: (ReactNode | string)[];
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
      item.key.forEach((keyItem) => res.push({ key: keyItem, content: [...contentArr] }));
    } else {
      res.push({ key: item.key, content: [...contentArr] });
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
