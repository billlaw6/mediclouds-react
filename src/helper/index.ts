import { personalReq } from "_axios";
import { ReactNode } from "react";
import { GetSearchQueryPropsI } from "_types/api";
import CryptoJS from "crypto-js";
import moment from "moment";
import { ProdI } from "_types/product";

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
export const getQueryString = <T = any>(): any => {
  const search = window.location.search.substring(1);
  const param: { [key: string]: any } = {};
  const arr = search.split("&");

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i].split("=");
    if (!item[0]) continue;
    param[item[0]] = decodeURIComponent(item[1]);
  }

  return param as T;
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
/**
 * 手动更新已选择的列表
 *
 * @param {string[]} data 当前已选择的列表
 * @param {string} id 当前选择的id
 * @returns {string[]}
 */
export const getSelected = (data: string[], id: string): string[] => {
  const index = data.indexOf(id);

  if (index < 0) return [...data, id];
  return [...data, id].filter((item) => item !== id);
};

/**
 * 展平数组（一维）
 * @param {string[]} arr
 * @return {string[]}
 */
export const flattenArr = (arr: string[][]): string[] => new Array<string>().concat(...arr);

/**
 * 格式化日期
 *
 * @param {MomentInput} val 日期
 * @param {boolean} [time] 是否显示时间
 * @returns {string}
 */
export const formatDate = (val: string, time?: boolean): string => {
  const formatRule = `YYYY-MM-DD${time ? " HH:mm:ss" : ""}`;

  return moment(val).format(formatRule);
};

/**
 * 获取性别中文名字
 *
 * @param {number} val
 * @returns {string}
 */
export const getSexName = (val: number): string => {
  switch (val) {
    case 1:
      return "男";
    case 2:
      return "女";
    default:
      return "保密";
  }
};

/**
 * 获取年龄
 *
 * @param {string} birthday
 * @returns {number}
 */
export const getAgeByBirthday = (birthday: string): number => {
  return moment().year() - moment(birthday).year();
};

// 获取图片完全显示在视图区域并保持比例的信息：
// x, y：相对于视图区域的x，y轴坐标
// width，height：图片渲染的尺寸
interface DrawInfoPropsI {
  viewWidth: number;
  viewHeight: number;
  width: number;
  height: number;
}
interface DrawInfoResultI {
  x: number;
  y: number;
  width: number;
  height: number;
}
export const getDrawInfo = (props: DrawInfoPropsI): DrawInfoResultI => {
  let drawW = 0,
    drawH = 0,
    x = 0,
    y = 0;
  const { viewWidth, viewHeight, width, height } = props;

  if (viewWidth / width < viewHeight / height) {
    // 视图和图片宽度比 小于 视图和图片高度比， 宽度等于视图宽度
    drawW = viewWidth;
    drawH = (drawW * height) / width;
    y = (viewHeight - drawH) / 2;
  } else {
    // 视图和图片宽度比 大于 视图和图片高度比， 高度等于视图高度
    drawH = viewHeight;
    drawW = (drawH * width) / height;
    x = (viewWidth - drawW) / 2;
  }

  return { x, y, width: drawW, height: drawH };
};

interface ParseLungNoduleDescResI {
  title: string;
  content: string[];
  extra?: {
    title: string;
    content: string[];
  };
}

/**
 * 解析肺结节筛查报告的描述
 *
 * @param {string} val
 * @returns {ParseLungNoduleDescResI}
 */
export const parseLungNoduleDesc = (val: string): ParseLungNoduleDescResI => {
  const [primary = "", extra = ""] = val.split("&");
  const [title = "", contentVal = ""] = primary.split(":");

  const res: ParseLungNoduleDescResI = {
    title: title.trim(),
    content: contentVal
      .split(";")
      .map((item) => item.trim())
      .filter((item) => item),
  };

  if (extra) {
    const [extraTitle = "", extraContentVal = ""] = extra.split(":");

    res.extra = {
      title: extraTitle.trim(),
      content: extraContentVal
        .split(";")
        .map((item) => item.trim())
        .filter((item) => item),
    };
  }

  return res;
};

/**
 * 获取肺结节材质中文值
 * @param tex 材质 0 ｜ 1 ｜ 2
 */
export const getTexVal = (tex: 0 | 1 | 2): string => {
  switch (tex) {
    case 0:
      return "磨玻璃";
    case 1:
      return "部分实性";
    case 2:
      return "实性";
    default:
      return "";
  }
};

/**
 * 获取最大可观测的维度
 * @param val 纬度 0 ｜ 1 ｜ 2
 */
export const getMaxDimIdx = (val: 0 | 1 | 2): string => {
  switch (val) {
    case 0:
      return "横断面";
    case 1:
      return "冠状面";
    case 2:
      return "矢状面";
    default:
      return "";
  }
};

/**
 * 获取真实商品价格
 *
 * @param {ProdI} prod
 * @returns {number}
 */
export const getTrulyPrice = (prod: ProdI): number => {
  const { price, special_price } = prod;
  if (!special_price) return price;
  if (special_price < 0) return price;

  return special_price;
};
