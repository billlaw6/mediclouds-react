import { LungNoduleI } from "_types/ai";

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
  list: Map<LongAxisT, LungNoduleI[]>,
): Map<LongAxisT, LungNoduleI[]> => {
  const { long_axis } = data;
  const cacheList = new Map(list);

  if (long_axis < 6) {
    const minList = list.get("min") || [];
    const nextMinList: LungNoduleI[] = [...minList, data];
    cacheList.set("min", nextMinList);
  } else if (long_axis <= 8 && long_axis >= 6) {
    const midList = list.get("mid") || [];
    const nextMidList: LungNoduleI[] = [...midList, data];
    cacheList.set("min", nextMidList);
  } else {
    const maxList = list.get("max") || [];
    const nextMaxList: LungNoduleI[] = [...maxList, data];
    cacheList.set("min", nextMaxList);
  }

  return cacheList;
};
