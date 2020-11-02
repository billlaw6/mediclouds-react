import { LungNoduleI } from "_types/ai";
import { NodulesGroupI, NodulesGroupItemI } from "./types";

export type LongAxisT = "min" | "mid" | "max"; // min: 小于6mm mid: 6-8mm max: 大于8mm

/**
 * 对结节大小分类
 *
 * @param {LungNoduleI} data 结节
 * @param {Map<LongAxisT, LungNoduleI[]>} list 分类结节列表
 * @returns {Map<LongAxisT, LungNoduleI[]>}
 */
export const filterLongAxis = (
  data: LungNoduleI,
  list?: Map<LongAxisT, LungNoduleI[]>,
): Map<LongAxisT, LungNoduleI[]> | undefined => {
  if (!list) return;

  const { long_axis } = data;
  if (!long_axis) return;

  const cacheList = new Map(list);

  if (long_axis < 6) {
    const minList = list.get("min") || [];
    const nextMinList: LungNoduleI[] = [...minList, data];
    cacheList.set("min", nextMinList);
  } else if (long_axis <= 8 && long_axis >= 6) {
    const midList = list.get("mid") || [];
    const nextMidList: LungNoduleI[] = [...midList, data];
    cacheList.set("mid", nextMidList);
  } else {
    const maxList = list.get("max") || [];
    const nextMaxList: LungNoduleI[] = [...maxList, data];
    cacheList.set("max", nextMaxList);
  }

  return cacheList;
};

/**
 * 按长轴大小过滤
 *
 * @param {LungNoduleI[]} data
 * @returns {{ max: LungNoduleI[]; mid: LungNoduleI[]; min: LungNoduleI[] }}
 */
export const filterNoduleSize = (
  data: LungNoduleI[],
): { max: LungNoduleI[]; mid: LungNoduleI[]; min: LungNoduleI[] } => {
  const max: LungNoduleI[] = [], // 大于8mm
    mid: LungNoduleI[] = [], // 6 ～ 8 mm
    min: LungNoduleI[] = []; // 小于 6mm

  data.forEach((item) => {
    const { long_axis = 0 } = item;

    if (long_axis > 8) max.push(item);
    else if (long_axis < 6) min.push(item);
    else mid.push(item);
  });

  return { max, mid, min };
};

/**
 * 结节材质分类
 *
 * @param {LungNoduleI[]} data
 * @returns {{
 *   groudGlass: LungNoduleI[];
 *   solid: LungNoduleI[];
 *   subSolid: LungNoduleI[];
 * }}
 */
export const filterNoduleType = (
  data: LungNoduleI[],
): {
  [key: string]: any;
  groundGlass: LungNoduleI[];
  solid: LungNoduleI[];
  subSolid: LungNoduleI[];
} => {
  const groundGlass: LungNoduleI[] = [], // 磨玻璃
    solid: LungNoduleI[] = [], // 实性
    subSolid: LungNoduleI[] = []; // 亚实性

  data.forEach((item) => {
    switch (item.tex) {
      case 0:
        groundGlass.push(item);
        break;
      case 1:
        subSolid.push(item);
        break;
      case 2:
        solid.push(item);
        break;
      default:
        break;
    }
  });

  return { solid, subSolid, groundGlass };
};

/**
 * 根据真实结节可信度分类
 *
 * @param {LungNoduleI[]} data
 * @returns {{
 *   max: LungNoduleI[];
 *   min: LungNoduleI[];
 * }}
 */
export const filterNoduleProbable = (
  data: LungNoduleI[],
): {
  [key: string]: any;
  max: LungNoduleI[];
  min: LungNoduleI[];
} => {
  const max: LungNoduleI[] = [],
    min: LungNoduleI[] = [];

  data.forEach((item) => {
    const { score } = item;

    if (score > 0.7) max.push(item);
    else min.push(item);
  });

  return { max, min };
};

export const isEmptyGroup = (data?: NodulesGroupI): boolean => {
  if (!data) return true;

  for (const key of Object.keys(data)) {
    const item = data[key] as NodulesGroupItemI;

    for (const itemKey of Object.keys(item)) {
      const nodules = item[itemKey] as LungNoduleI[];
      if (nodules && nodules.length) return false;
    }
  }

  return true;
};
