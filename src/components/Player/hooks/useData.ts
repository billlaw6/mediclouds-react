import { useDispatch, useSelector } from "react-redux";
import { StoreStateI } from "_types/core";
import { getActiveCollections, setDataToCollection } from "../helpers";
import fetchSeriesList from "../methods/fetchSeriesList";
import initCornerstone from "../methods/initCornerstone";
import {
  PlayerExamI,
  PlayerExamMapT,
  PlayerSeriesI,
  PlayerSeriesMapT,
  PlayerActionE,
  PlayerExamPropsI,
} from "../types";

const { UPDATE_PLAYER, INIT_PLAYER } = PlayerActionE;

interface CachePropsI {
  cs: any;
  csImgLoader: any;
  data?: PlayerSeriesI;
  onBeforeCache?: (data: PlayerSeriesI) => void; // 缓存前触发 返回当前DataI
  onCaching?: (progress: number, data: PlayerSeriesI) => void; // 缓存中触发 返回百分比进度
  onCached?: (data: PlayerSeriesI) => void; // 缓存后触发 返回当前DataI
}

export default () => {
  const playerReducerData = useSelector<StoreStateI, StoreStateI["player"]>(
    (state) => state.player,
  );

  const { playerExamMap, cs, cst } = playerReducerData;

  const dispatch = useDispatch();

  /** 获取所有激活的检查的当前资源 */
  const getCurrentSeries = (data?: PlayerExamMapT): PlayerSeriesI[] | undefined => {
    const _map = data || playerExamMap;

    if (!_map) return;
    const res: PlayerSeriesI[] = [];
    const activeCollections = getActiveCollections(_map);

    activeCollections.forEach((collection) => {
      const { seriesIndex, playerSeriesMap } = collection;
      const currentData = playerSeriesMap.get(seriesIndex);
      if (currentData) res.push(currentData);
    });

    return res;
  };

  /** 缓存数据 */
  const cacheSeries = async (props: CachePropsI): Promise<any[]> => {
    const { cs, csImgLoader, data, onCached, onBeforeCache, onCaching } = props;

    const processes: Promise<any>[] = [];
    if (!data) return [];

    const { dicoms, id } = data;

    let loadImgUrls: string[] = dicoms,
      count = 0;

    const onProgress = (event: any) => {
      const { detail } = event;
      const { total, loaded } = detail;

      onCaching && onCaching(Math.round((loaded * 100) / total), data);
    };

    const onLoaded = (event: any) => {
      count += 1;
      onCaching && onCaching(Math.round((count * 100) / loadImgUrls.length), data);
    };

    try {
      onBeforeCache && onBeforeCache(data);

      if (loadImgUrls.length === 1) {
        cs.events.addEventListener("cornerstoneimageloadprogress", onProgress);

        const singleUrl = loadImgUrls[0];
        const dataSetRes = await csImgLoader.wadouri.dataSetCacheManager.load(
          singleUrl,
          csImgLoader.internal.xhrRequest,
        );

        const numFrames = dataSetRes.intString("x00280008");
        if (numFrames) {
          const imgIds: string[] = [];

          for (let i = 0; i < numFrames; i++) {
            imgIds.push(`${singleUrl}?frame=${i}`);
          }

          loadImgUrls = imgIds;
        }
      } else {
        cs.events.addEventListener("cornerstoneimageloaded", onLoaded);
      }

      loadImgUrls = loadImgUrls.map((url) => `wadouri:${url}`);

      loadImgUrls.forEach((url) => {
        processes.push(cs.loadAndCacheImage(url));
      });

      const res = await Promise.all(processes);
      loadImgUrls.forEach((url) => {
        csImgLoader.wadouri.dataSetCacheManager.unload(url);
      });

      cs.events.removeEventListener("cornerstoneimageloadprogress", onProgress);
      cs.events.removeEventListener("cornerstoneimageloaded", onLoaded);

      onCached && onCached(data);

      return res;
    } catch (error) {
      throw new Error(error);
    }
  };

  /** 初始化播放器 */
  const init = async (exams: PlayerExamPropsI[]) => {
    if (!exams) throw new Error("must have exams.");

    const { cs, cst, csImgLoader } = initCornerstone();

    const seriesListRes = await fetchSeriesList(exams);
    const _playerExamMap: PlayerExamMapT = new Map();

    /** 构建CollectionMap */
    exams.forEach((exam, examIndex) => {
      const { id, active, defaultSeriesId, defaultFrame = 0 } = exam;
      const currentSeriesList = seriesListRes[examIndex];
      const { children, ...patientInfo } = currentSeriesList;
      const seriesIndex = Math.max(
        0,
        children.findIndex((item) => item.id === defaultSeriesId),
      ); // 初始化激活的序列索引
      const playerSeriesMap: PlayerSeriesMapT = new Map();

      children.forEach((item, seriesIndex) => {
        playerSeriesMap.set(
          seriesIndex,
          Object.assign({}, item, {
            frame: defaultFrame,
            examIndex,
            seriesIndex,
            progress: -1,
          }),
        );
      });

      const collection: PlayerExamI = {
        index: examIndex,
        examId: id,
        active,
        playerSeriesMap,
        seriesIndex,
        patientInfo,
      };
      _playerExamMap.set(examIndex, collection);
    });

    dispatch({
      type: INIT_PLAYER,
      payload: {
        cs,
        cst,
        csImgLoader,
        playerExamMap: _playerExamMap,
      },
    });

    const currentSeriesList = getCurrentSeries(_playerExamMap);
    if (currentSeriesList) {
      const cacheList: Promise<any>[] = [];

      currentSeriesList.forEach((series) => {
        cacheList.push(
          cacheSeries({
            cs,
            csImgLoader,
            data: series,
            onBeforeCache: (series) => {
              console.log("on before", series);
            },
            onCaching: (progress, series) => {
              console.log("progress", progress);
            },
            onCached: (series) => {
              console.log("on cached", series);
            },
          }),
        );
      });

      const res = await Promise.all(cacheList);
      console.log("cached res", res);
    }
  };

  const updatePlayerExamMap = (data: PlayerExamMapT) => {
    dispatch({
      type: UPDATE_PLAYER,
      payload: {
        playerExamMap: data,
      },
    });
  };

  /** 更新多个检查的序列 */
  const updateSeries = (datas: PlayerSeriesI[]): void => {
    if (!playerExamMap) return;

    const nextCollectionMap = new Map(playerExamMap);
    datas.forEach((data) => {
      const { examIndex, seriesIndex } = data;
      const nextCollection = setDataToCollection(playerExamMap, examIndex, seriesIndex, data);
      nextCollectionMap.set(examIndex, nextCollection);
    });

    updatePlayerExamMap(nextCollectionMap);
  };

  return {
    ...playerReducerData,
    currentSeries: getCurrentSeries(),
    fetchSeriesList,
    updateSeries,
    updatePlayerExamMap,
    getCurrentSeries,
    cacheSeries,
    initCornerstone,
    init,
  };
};
