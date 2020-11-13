import { PlayerDataI } from "_pages/player/type";

export interface ViewportPropsI {
  cs: any; // cornerstone
  cst: any; // cornerstone-tools
  className?: string;
  hidden?: boolean; // 是否隐藏视图
  data?: PlayerDataI; // 当前需要渲染的数据
}
