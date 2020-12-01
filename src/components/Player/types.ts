export interface PlayerPropsI {
  id: string; // exam id
  defaultSeries?: string; // 初始化序列id
  defaultFrame?: number; // 初始化帧索引
}

/** 播放器动作 */
export enum PlayerActionE {
  INIT_CS = "init_cs", // 全局cornerstone
  INIT_CST = "init_cst", // 全局cornerstone tools
  UPDATE = "update", // 更新指定state
  UPDATE_DATA = "update_data", // 更新data数据
  UPDATE_DATA_ITEM = "update_data_item", // 更新一个player data数据
  UPDATE_SERIES_INDEX = "update_series_index", // 更新当前的series索引
}
