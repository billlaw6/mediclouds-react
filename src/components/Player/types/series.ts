import { SeriesI } from "mc-api";
import { PlayerExamKeyT } from "./exam";

export type PlayerSeriesKeyT = number;

export interface PlayerSeriesI extends SeriesI {
  [key: string]: any;
  key: PlayerSeriesKeyT; // series map key
  cache?: any[]; // cornerstone image array
  examKey: PlayerExamKeyT; // exam map key
  frame: number;
  progress?: number; // caching progress max: 100
}

export type PlayerSeriesMapT = Map<PlayerSeriesKeyT, PlayerSeriesI>;
