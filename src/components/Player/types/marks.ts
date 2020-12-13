export interface PlayerMarkI {
  examKey: number;
  seriesKey: number;
  frame: number;
  desc?: string; // 描述
  data: any; // cornerstone Tool 的state
}

export interface PlayerMarksI {
  // key 为 cornerstone Tool 名称
  [key: string]: PlayerMarkI[];
}

export enum PlayerMarksActionE {
  ADD_MARK = "add_mark", // 添加一个标记
  DEL_MARK = "del_mark", // 删除一个标记
  UPDATE_MARK = "update_mark", // 修改一个标记
  ACTIVE_MARK = "active_mark", // 激活一个标记
}

export interface PlayerMarksAddMarkPayloadI {
  toolName: string;
  data: PlayerMarkI;
}

export interface PlayerMarksUpdateMarkPayloadI {
  toolName: string;
  nextMark: PlayerMarkI;
}

export interface PlayerMarksSelectMarkPayloadI {
  toolName: string;
  id: string;
}

export interface PlayerMarksDelMarkPayloadI {
  toolName: string;
  id: string; // mark data id
}
