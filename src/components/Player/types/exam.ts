import { PatientExamI } from "_types/api";
import { PlayerSeriesMapT } from "./series";

export type PlayerExamKeyT = number;

export interface PlayerExamI {
  id: string; // exam id
  key: PlayerExamKeyT; // examMap key
  patientInfo: PatientExamI;
  isActive: boolean;
  data: PlayerSeriesMapT; // Player Series Map
}

export type PlayerExamMapT = Map<PlayerExamKeyT, PlayerExamI>;
