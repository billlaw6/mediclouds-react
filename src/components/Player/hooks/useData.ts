import { useDispatch, useSelector } from "react-redux";
import { StoreStateI } from "_types/core";
import { getActiveCollections, setDataToCollection } from "../helpers";
import { CollectionMapT, DataI, PlayerActionE } from "../types";

const { INIT_CST, INIT_CS, INIT_CS_IMGLOADER, UPDATE_COLLECTION_MAP } = PlayerActionE;

export default () => {
  const playerReducerData = useSelector<StoreStateI, StoreStateI["player"]>(
    (state) => state.player,
  );

  const { collectionMap } = playerReducerData;

  const dispaych = useDispatch();

  /** 获取所有激活的检查的当前资源 */
  const getCurrentDatas = (data?: CollectionMapT): DataI[] | undefined => {
    const _map = data || collectionMap;

    if (!_map) return;
    const res: DataI[] = [];
    const activeCollections = getActiveCollections(_map);

    activeCollections.forEach((collection) => {
      const { seriesIndex, dataMap } = collection;
      const currentData = dataMap.get(seriesIndex);
      if (currentData) res.push(currentData);
    });

    return res;
  };

  const initCs = (cs: any): void => {
    dispaych({ type: INIT_CS, payload: cs });
  };
  const initCst = (cst: any): void => {
    dispaych({ type: INIT_CST, payload: cst });
  };
  const initCsImgLoader = (csImgloader: any): void => {
    dispaych({ type: INIT_CS_IMGLOADER, payload: csImgloader });
  };

  const updateCollectionMap = (data: CollectionMapT): void => {
    dispaych({
      type: UPDATE_COLLECTION_MAP,
      payload: data,
    });
  };

  /** 更新多个检查的数据 */
  const updateDatas = (datas: DataI[]): void => {
    if (!collectionMap) return;

    const nextCollectionMap = new Map(collectionMap);
    datas.forEach((data) => {
      const { examIndex, seriesIndex } = data;
      const nextCollection = setDataToCollection(collectionMap, examIndex, seriesIndex, data);
      nextCollectionMap.set(examIndex, nextCollection);
    });

    updateCollectionMap(nextCollectionMap);
  };

  return {
    ...playerReducerData,
    currentDatas: getCurrentDatas(),
    initCs,
    initCst,
    initCsImgLoader,
    updateDatas,
    updateCollectionMap,
    getCurrentDatas,
  };
};
