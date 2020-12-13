export interface PlayerExamPropsI {
  id: string; // exam id
  defaultSeriesId?: string; // 初始化序列id
  defaultFrame?: number; // 初始化帧索引
  active: boolean; // 是否激活此序列
  lungnodule?: boolean; // 是否启用肺结节筛查
}

export interface PlayerPropsI {
  exams: PlayerExamPropsI[];
}

export type CstToolNameT = "Wwwc" | "Length" | "Pan" | "Zoom" | "";
