import { PatientExamI } from "_types/api";

export type PlayerExamKeyT = number;

export interface PlayerExamI {
  id: string; // exam id
  key: PlayerExamKeyT; // examMap key
  patientInfo: PatientExamI;
  isActive: boolean;
  data: any; // Player Series Map
}

export type PlayerExamMapT = Map<PlayerExamKeyT, PlayerExamI>;
