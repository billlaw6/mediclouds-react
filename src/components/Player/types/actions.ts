/** 播放器动作 */
export enum PlayerActionE {
  INIT_PLAYER = "init_player", // 初始化播放器
  INIT_LUNG_NODULE_REPORT = "init_lung_nodule_report", // 初始化肺结节报告
  UPDATE_PLAYER = "update_player", // 更新任意值
  INIT_CORNERSTONE = "init_cornerstone", // 初始化全局cornerstone
  UPDATE_PLAYER_EXAM_MAP = "update_player_exam_map", // 更新检查映射集合
  UPDATE_CURRENT_LUNG_NODULES_REPORT = "update_current_lung_nodules_report", // 更新当前的肺结节AI筛查数据
}

/* 窗口动作 */
export enum PlayerWindowsActionE {
  OPEN_WINDOW = "open_window", // 打开窗口
  COLSE_WINDOW = "close_window", // 关闭窗口
  UPDATE_WINDOW = "update_window", // 更新窗口
  ACTIVE_WINDOW = "active_window", // 激活某个窗口
  UPDATE_WINDOWS = "update_windows", // 更新整个windows
}
