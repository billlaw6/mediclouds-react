import { PlayerSeriesI } from "./series";

export type WindowKeyT = number;

export interface WindowI {
  [key: string]: any;
  key: WindowKeyT;
  data?: PlayerSeriesI;
  element?: HTMLElement;
  frame: number;
  isActive?: boolean;
  isFocus: boolean;
  isPlay: boolean;
}

export type WindowMapT = Map<WindowKeyT, WindowI>;

export enum WindowActionE {
  PLAY = "player_window_play",
  PAUSE = "player_window_pause",
}
