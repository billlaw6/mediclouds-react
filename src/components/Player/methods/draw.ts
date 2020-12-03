/**
 * cs上绘制内容
 *
 */

import { DataI } from "../types";

interface DrawPropsI {
  cs: any; // cornerstone
  data?: DataI; // 当前的播放器资源
  el: HTMLElement; // 渲染的HTML元素
}

export default (props: DrawPropsI): void => {
  const { data, cs, el } = props;
  if (!data) return;
  const { cache, frame } = data;
  if (!cache) return;

  const currentImg = cache[frame];
  cs.displayImage(el, currentImg);
};
