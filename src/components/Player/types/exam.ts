import { PatientExamI } from "mc-api";
import { PlayerSeriesMapT } from "./series";

export type PlayerExamKeyT = number;

export interface PlayerExamI {
  id: string; // exam id
  key: PlayerExamKeyT; // examMap key
  patientInfo?: PatientExamI;
  data: PlayerSeriesMapT; // Player Series Map
  isActive: boolean;
  isAnonymous: boolean; // 是否匿名
}

export type PlayerExamMapT = Map<PlayerExamKeyT, PlayerExamI>;
