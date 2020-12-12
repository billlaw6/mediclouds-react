import { PlayerExamI, PlayerExamKeyT, PlayerExamMapT } from "../types/exam";
import { PlayerSeriesI, PlayerSeriesKeyT, PlayerSeriesMapT } from "../types/series";

/** 根据索引在检查映射集合内获取检查数据 */
export const getCollection = (
  playerExamMap: PlayerExamMapT,
  index: number,
): PlayerExamI | undefined => playerExamMap.get(index);

/** 使用exam id获取检查数据 */
export const getCollectionById = (
  examKey: PlayerExamKeyT,
  playerExamMap?: PlayerExamMapT,
): PlayerExamI | undefined => {
  if (!playerExamMap) return;

  for (const value of playerExamMap.values()) {
    if (value.key === examKey) return value;
  }
};

/** 获取已激活的检查数据数组 */
export const getActiveCollections = (playerExamMap: PlayerExamMapT): PlayerExamI[] => {
  const res: PlayerExamI[] = [];
  playerExamMap.forEach((item) => item.isActive && res.push(item));

  return res;
};

/** 根据检查索引列表，获取多个检查的数据 */
export const getDataMaps = (
  playerExamMap: PlayerExamMapT,
  keys: PlayerExamKeyT[],
): (PlayerExamI | undefined)[] => {
  const res: (PlayerExamI | undefined)[] = [];

  keys.forEach((item) => {
    const collection = getCollection(playerExamMap, item);
    collection && res.push(collection);
  });

  return res;
};

/** 根据序列索引，在数据映射集内获取相应数据 */
export const getData = (
  dataMap: PlayerSeriesMapT,
  key: PlayerSeriesKeyT,
): PlayerSeriesI | undefined => dataMap.get(key);

/**
 * 根据检查索引和序列索引，在检查数据映射集内获取相应数据
 *
 * @param {PlayerExamMapT} playerExamMap 检查映射集合
 * @param {PlayerExamKeyT} playerExamKey 检查key
 * @param {PlayerSeriesIndexT} dataIndex 数据索引
 * @returns {(PlayerSeriesI | undefined)} 返回数据
 */
export const getDataByCollection = (
  playerExamMap: PlayerExamMapT,
  examKey: PlayerExamKeyT,
  seriesKey: PlayerExamKeyT,
): PlayerSeriesI | undefined => {
  const collection = getCollection(playerExamMap, examKey);
  if (!collection) return;

  return getData(collection.data, seriesKey);
};

/**
 * 把数据写入相应的数据映射集合，如果集合不存在，则创建集合
 *
 * 数据为增量更新
 *
 * 返回一个新数据集合
 *
 * @param {PlayerSeriesMapT | undefined} dataMap 当前的数据映射集合
 * @param {PlayerSeriesIndexT} index 目标数据索引
 * @param {any} data 数据
 * @return {PlayerSeriesMapT}
 */
export const setData = (
  dataMap: PlayerSeriesMapT | undefined,
  key: PlayerSeriesKeyT,
  data: any,
): PlayerSeriesMapT => {
  const nextDataMap: PlayerSeriesMapT = dataMap ? new Map(dataMap) : new Map();
  const currentData = getData(nextDataMap, key);

  nextDataMap.set(key, Object.assign({}, currentData, data));

  return nextDataMap;
};
/**
 * 把数据写入相应的检查映射集合，如果集合不存在，则创建集合
 *
 * 数据为增量更新
 *
 * 返回一个新检查集合
 *
 * @param {(PlayerExamMapT | undefined)} playerExamMap
 * @param {PlayerExamIndexT} collectionIndex
 * @param {*} data
 * @returns {PlayerExamMapT}
 */
export const setCollection = (
  playerExamMap: PlayerExamMapT | undefined,
  examKey: PlayerExamKeyT,
  data: any,
): PlayerExamMapT => {
  const nextCollectionMap: PlayerExamMapT = playerExamMap ? new Map(playerExamMap) : new Map();
  nextCollectionMap.set(examKey, data);

  return nextCollectionMap;
};

/**
 * 把数据写入相应的检查映射集合，如果集合不存在，则创建集合
 *
 * 数据为增量更新
 *
 * 返回新的CollectionI
 *
 *
 * @param {(PlayerExamMapT | undefined)} playerExamMap
 * @param {PlayerExamIndexT} collectionIndex
 * @param {PlayerSeriesIndexT} dataIndex
 * @param {*} data
 */
export const setDataToPlayerSeriesMap = (
  playerExamMap: PlayerExamMapT,
  examKey: PlayerExamKeyT,
  seriesKey: PlayerSeriesKeyT,
  data: any,
): PlayerExamI => {
  if (!playerExamMap) throw new Error("Collection Map not found.");
  const collection = playerExamMap.get(examKey);
  if (!collection) throw new Error("Collection not found.");
  const nextDataMap = setData(collection.data, seriesKey, data);
  collection.data = nextDataMap;

  return collection;
};

/** 获取dicom信息 */
export const getInfoByDicom = (img: any) => {
  const { data } = img;

  return {
    // 检查信息
    study: {
      id: data.string("x00200010"), // 检查id
      date: data.string("x00080020"), // 检查日期
      examined: data.string("x00180015"), // 扫描部位
      desc: data.string("x00801030"), // 检查描述
      modality: data.string("x00080060"), // 检查类型
    },
    /** 此序列信息 */
    series: {
      id: data.string("x0020000E"), // series id
      position: data.string("x00200032"), // 图像位置
      orientation: data.string("x00200037"), // 图像方位
      thickness: data.string("00180050"), // 层厚
    },
    /** 患者信息 */
    patient: {
      name: data.string("x00100010"), // 姓名
      id: data.string("x00100020"), // id
      birthday: data.string("x00100030"), // 生日
      six: data.string("x00100040"), // 性别
      age: data.string("x00101010"), // 年龄
    },
    /** 检查机构 */
    hospital: {
      name: data.string("x00080080"), // 机构名称
    },
  };
};
