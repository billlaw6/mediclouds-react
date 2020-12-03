import {
  CollectionI,
  CollectionIndexT,
  CollectionMapT,
  DataI,
  DataIndexT,
  DataMapT,
} from "../types";

/** 根据索引在检查映射集合内获取检查数据 */
export const getCollection = (
  collectionMap: CollectionMapT,
  index: number,
): CollectionI | undefined => collectionMap.get(index);

/** 使用exam id获取检查数据 */
export const getCollectionById = (
  examId: string,
  collectionMap?: CollectionMapT,
): CollectionI | undefined => {
  if (!collectionMap) return;

  for (const value of collectionMap.values()) {
    if (value.examId === examId) return value;
  }
};

/** 获取已激活的检查数据数组 */
export const getActiveCollections = (collectionMap: CollectionMapT): CollectionI[] => {
  const res: CollectionI[] = [];
  collectionMap.forEach((item) => item.active && res.push(item));

  return res;
};

/** 根据检查索引列表，获取多个检查的数据 */
export const getDataMaps = (
  collectionMap: CollectionMapT,
  indexs: CollectionIndexT[],
): (CollectionI | undefined)[] => {
  const res: (CollectionI | undefined)[] = [];

  indexs.forEach((item) => {
    const collection = getCollection(collectionMap, item);
    collection && res.push(collection);
  });

  return res;
};

/** 根据序列索引，在数据映射集内获取相应数据 */
export const getData = (dataMap: DataMapT, index: DataIndexT): DataI | undefined =>
  dataMap.get(index);

/**
 * 根据检查索引和序列索引，在检查数据映射集内获取相应数据
 *
 * @param {CollectionMapT} collectionMap 检查映射集合
 * @param {CollectionIndexT} collectionIndex 检查索引
 * @param {DataIndexT} dataIndex 数据索引
 * @returns {(DataI | undefined)} 返回数据
 */
export const getDataByCollection = (
  collectionMap: CollectionMapT,
  collectionIndex: CollectionIndexT,
  dataIndex: DataIndexT,
): DataI | undefined => {
  const collection = getCollection(collectionMap, collectionIndex);
  if (!collection) return;

  return getData(collection.dataMap, dataIndex);
};

/**
 * 把数据写入相应的数据映射集合，如果集合不存在，则创建集合
 *
 * 数据为增量更新
 *
 * 返回一个新数据集合
 *
 * @param {DataMapT | undefined} dataMap 当前的数据映射集合
 * @param {DataIndexT} index 目标数据索引
 * @param {any} data 数据
 * @return {DataMapT}
 */
export const setData = (dataMap: DataMapT | undefined, index: DataIndexT, data: any): DataMapT => {
  const nextDataMap: DataMapT = dataMap ? new Map(dataMap) : new Map();
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
 * @param {(CollectionMapT | undefined)} collectionMap
 * @param {CollectionIndexT} collectionIndex
 * @param {*} data
 * @returns {CollectionMapT}
 */
export const setCollection = (
  collectionMap: CollectionMapT | undefined,
  collectionIndex: CollectionIndexT,
  data: any,
): CollectionMapT => {
  const nextCollectionMap: CollectionMapT = collectionMap ? new Map(collectionMap) : new Map();
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
 * @param {(CollectionMapT | undefined)} collectionMap
 * @param {CollectionIndexT} collectionIndex
 * @param {DataIndexT} dataIndex
 * @param {*} data
 */
export const setDataToCollection = (
  collectionMap: CollectionMapT,
  collectionIndex: CollectionIndexT,
  dataIndex: DataIndexT,
  data: any,
): CollectionI => {
  if (!collectionMap) throw new Error("Collection Map not found.");
  const collection = collectionMap.get(collectionIndex);
  if (!collection) throw new Error("Collection not found.");
  const nextDataMap = setData(collection.dataMap, dataIndex, data);
  collection.dataMap = nextDataMap;

  return collection;
};
