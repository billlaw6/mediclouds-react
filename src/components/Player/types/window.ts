import { PlayerSeriesI } from "./series";

export type WindowKeyT = number;

export interface WindowI {
  key: WindowKeyT;
  data?: PlayerSeriesI;
  element?: HTMLElement;
  frame: number;
  isActive?: boolean;
  isFocus: boolean;
  isPlay: boolean;
}

export type WindowMapT = Map<WindowKeyT, WindowI>;
