import { LungNoduleI } from "_types/ai";

/* 结节渲染结构 */
export interface RenderDataI {
  [key: string]: any;
  groundGlass?: NodulesGroupI; // 磨玻璃组
  subSolid?: NodulesGroupI; // 亚实性组
  solid?: NodulesGroupI; // 实性组
}

/* 渲染结节组结构 */
export interface NodulesGroupI {
  [key: string]: any;
  max?: NodulesGroupItemI; // 真实结节概率大于70%
  min?: NodulesGroupItemI; // 真实结节概率小于70%
}

/* 渲染结节组成员结构 */
export interface NodulesGroupItemI {
  [key: string]: LungNoduleI[];
  max: LungNoduleI[]; // 8mm以上结节
  mid: LungNoduleI[]; // 6 ~ 8 mm 结节
  min: LungNoduleI[]; // 6mm 以下结节
}
