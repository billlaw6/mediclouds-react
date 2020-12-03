/**
 * cs上绘制内容
 *
 */

import { DataI, WindowI } from "../types";

interface DrawPropsI {
  cs: any; // cornerstone
  win?: WindowI;
  // data?: DataI; // 当前的播放器资源
  // el: HTMLElement; // 渲染的HTML元素
}

export default (props: DrawPropsI): void => {
  const { win, cs } = props;
  if (!win) return;

  const { element, data, frame: frameInWindow = -1 } = win;

  if (!data || !element) return;

  const { cache, frame } = data;
  if (!cache) return;

  const index = frameInWindow > -1 ? frameInWindow : frame;

  const currentImg = cache[index];
  cs.displayImage(element, currentImg);
};
