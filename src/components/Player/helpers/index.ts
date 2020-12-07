import {
  PlayerExamI,
  PlayerExamIndexT,
  PlayerExamMapT,
  PlayerSeriesI,
  PlayerSeriesIndexT,
  PlayerSeriesMapT,
} from "../types";

/** 根据索引在检查映射集合内获取检查数据 */
export const getCollection = (
  playerExamMap: PlayerExamMapT,
  index: number,
): PlayerExamI | undefined => playerExamMap.get(index);

/** 使用exam id获取检查数据 */
export const getCollectionById = (
  examId: string,
  playerExamMap?: PlayerExamMapT,
): PlayerExamI | undefined => {
  if (!playerExamMap) return;

  for (const value of playerExamMap.values()) {
    if (value.examId === examId) return value;
  }
};

/** 获取已激活的检查数据数组 */
export const getActiveCollections = (playerExamMap: PlayerExamMapT): PlayerExamI[] => {
  const res: PlayerExamI[] = [];
  playerExamMap.forEach((item) => item.active && res.push(item));

  return res;
};

/** 根据检查索引列表，获取多个检查的数据 */
export const getDataMaps = (
  playerExamMap: PlayerExamMapT,
  indexs: PlayerExamIndexT[],
): (PlayerExamI | undefined)[] => {
  const res: (PlayerExamI | undefined)[] = [];

  indexs.forEach((item) => {
    const collection = getCollection(playerExamMap, item);
    collection && res.push(collection);
  });

  return res;
};

/** 根据序列索引，在数据映射集内获取相应数据 */
export const getData = (
  dataMap: PlayerSeriesMapT,
  index: PlayerSeriesIndexT,
): PlayerSeriesI | undefined => dataMap.get(index);

/**
 * 根据检查索引和序列索引，在检查数据映射集内获取相应数据
 *
 * @param {PlayerExamMapT} playerExamMap 检查映射集合
 * @param {PlayerExamIndexT} collectionIndex 检查索引
 * @param {PlayerSeriesIndexT} dataIndex 数据索引
 * @returns {(PlayerSeriesI | undefined)} 返回数据
 */
export const getDataByCollection = (
  playerExamMap: PlayerExamMapT,
  collectionIndex: PlayerExamIndexT,
  dataIndex: PlayerSeriesIndexT,
): PlayerSeriesI | undefined => {
  const collection = getCollection(playerExamMap, collectionIndex);
  if (!collection) return;

  return getData(collection.playerSeriesMap, dataIndex);
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
  index: PlayerSeriesIndexT,
  data: any,
): PlayerSeriesMapT => {
  const nextDataMap: PlayerSeriesMapT = dataMap ? new Map(dataMap) : new Map();
  const currentData = getData(nextDataMap, index);

  nextDataMap.set(index, Object.assign({}, currentData, data));

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
  collectionIndex: PlayerExamIndexT,
  data: any,
): PlayerExamMapT => {
  const nextCollectionMap: PlayerExamMapT = playerExamMap ? new Map(playerExamMap) : new Map();
  nextCollectionMap.set(collectionIndex, data);

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
export const setDataToCollection = (
  playerExamMap: PlayerExamMapT,
  collectionIndex: PlayerExamIndexT,
  dataIndex: PlayerSeriesIndexT,
  data: any,
): PlayerExamI => {
  if (!playerExamMap) throw new Error("Collection Map not found.");
  const collection = playerExamMap.get(collectionIndex);
  if (!collection) throw new Error("Collection not found.");
  const nextDataMap = setData(collection.playerSeriesMap, dataIndex, data);
  collection.playerSeriesMap = nextDataMap;

  return collection;
};
