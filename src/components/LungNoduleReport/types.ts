import { LungNoduleI } from "mc-api";

/* 结节渲染结构 */
export interface RenderDataI {
  [key: string]: any;
  groundGlass?: NoduleItemsI; // 磨玻璃组
  subSolid?: NoduleItemsI; // 部分实性组
  solid?: NoduleItemsI; // 实性组
}

/* 渲染结节成员结构 */
export interface NoduleItemsI {
  [key: string]: LungNoduleI[];
  max: LungNoduleI[]; // 8mm以上结节
  mid: LungNoduleI[]; // 6 ~ 8 mm 结节
  min: LungNoduleI[]; // 6mm 以下结节
}
