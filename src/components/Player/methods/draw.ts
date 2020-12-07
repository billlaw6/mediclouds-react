/**
 * cs上绘制内容
 *
 */

import { PlayerSeriesI, WindowI } from "../types";

interface DrawPropsI {
  cs: any; // cornerstone
  win?: WindowI;
  // data?: PlayerSeriesI; // 当前的播放器资源
  // el: HTMLElement; // 渲染的HTML元素
}

export default (props: DrawPropsI): void => {
  const { win, cs } = props;
  if (!win) return;

  const { element, playerSeries, frame: frameInWindow = -1 } = win;

  if (!playerSeries || !element) return;

  const { cache, frame } = playerSeries;
  if (!cache) return;

  const index = frameInWindow > -1 ? frameInWindow : frame;

  const currentImg = cache[index];
  cs.displayImage(element, currentImg);
};
