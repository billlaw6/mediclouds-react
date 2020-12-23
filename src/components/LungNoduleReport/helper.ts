import { LungNoduleI } from "_types/ai";
import { NoduleItemsI, RenderDataI } from "./types";

export type LongAxisT = "min" | "mid" | "max"; // min: 小于6mm mid: 6-8mm max: 大于8mm

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
    subSolid: LungNoduleI[] = []; // 部分实性

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
 *  过滤相对真实的结节
 *
 *  概率 >= .45  体积 >= 7
 *
 * @param {LungNoduleI[]} data
 * @returns {{real: LungNoduleI[], fake: LungNoduleI[]}}
 */
export const filterNodulesTruth = (data: LungNoduleI[]) => {
  const real: LungNoduleI[] = [],
    fake: LungNoduleI[] = [];

  data.forEach((nodule) => {
    const { score, vol } = nodule;

    if (score >= 0.45 && vol >= 7) real.push(nodule);
    else fake.push(nodule);
  });

  return { real, fake };
};

/**
 * 分析并返回结节不同材质的数量
 *
 * @param {LungNoduleI[]} data
 * @returns
 */
export const getCountWithNoduleType = (data: LungNoduleI[]) => {
  let solid = 0,
    subSolid = 0,
    groundGlass = 0;

  data.forEach((nodule) => {
    const { tex } = nodule;
    switch (tex) {
      case 0:
        groundGlass++;
        break;
      case 1:
        subSolid++;
        break;
      case 2:
        solid++;
        break;
      default:
        break;
    }
  });

  return { solid, subSolid, groundGlass };
};

/**
 * 获取渲染Data
 * @param data
 */
export const getRenderData = (data?: LungNoduleI[]): RenderDataI | undefined => {
  if (!data) return;

  const renderData: RenderDataI = {};

  /* 依结节性质分类 */
  const typeRes = filterNoduleType(data);
  for (const typeKey of Object.keys(typeRes)) {
    const data = typeRes[typeKey] || [];

    /* 依结节长轴尺寸分类 */
    const sizeRes = filterNoduleSize(data);
    const groupItem: NoduleItemsI = sizeRes;

    renderData[typeKey] = groupItem;
  }

  return renderData;
};
