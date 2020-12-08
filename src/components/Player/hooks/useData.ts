import { useDispatch, useSelector } from "react-redux";
import { StoreStateI } from "_types/core";
import { setDataToPlayerSeriesMap } from "../helpers";
import fetchSeriesList from "../methods/fetchSeriesList";
import initCornerstone from "../methods/initCornerstone";

import { PlayerActionE } from "../types/actions";
import { PlayerExamPropsI } from "../types/common";
import { PlayerExamI, PlayerExamMapT } from "../types/exam";
import { PlayerSeriesI, PlayerSeriesMapT } from "../types/series";

const { UPDATE_PLAYER, INIT_PLAYER } = PlayerActionE;

interface CachePropsI {
  data?: PlayerSeriesI;
  onBeforeCache?: (data: PlayerSeriesI) => void; // 缓存前触发 返回当前DataI
  onCaching?: (progress: number, data: PlayerSeriesI) => void; // 缓存中触发 返回百分比进度
  onCached?: (data: PlayerSeriesI) => void; // 缓存后触发 返回当前DataI
}

export default () => {
  const playerReducerData = useSelector<StoreStateI, StoreStateI["player"]>(
    (state) => state.player,
  );

  const { playerExamMap, cs, cst, csImgLoader } = playerReducerData;

  const dispatch = useDispatch();

  /** 缓存数据 */
  const cacheSeries = async (props: CachePropsI): Promise<any[]> => {
    if (!cs || !csImgLoader)
      throw new Error("not found cornerstone or cornerstoneWADOImageLoader library.");
    const { data, onCached, onBeforeCache, onCaching } = props;

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
  const initPlayerExamMap = async (exams: PlayerExamPropsI[]): Promise<PlayerExamMapT> => {
    if (!exams) throw new Error("must have exams.");

    const { cs, cst, csImgLoader } = initCornerstone();

    const seriesListRes = await fetchSeriesList(exams);
    const _playerExamMap: PlayerExamMapT = new Map();

    /** 构建CollectionMap */
    exams.forEach((exam, examIndex) => {
      const { id, active, defaultFrame = 0 } = exam;
      const currentSeriesList = seriesListRes[examIndex];
      const { children, ...patientInfo } = currentSeriesList;
      const playerSeriesMap: PlayerSeriesMapT = new Map();

      children.forEach((item, seriesIndex) => {
        playerSeriesMap.set(
          seriesIndex,
          Object.assign({}, item, {
            key: seriesIndex,
            examKey: examIndex,
            frame: defaultFrame,
            examIndex,
            seriesIndex,
            progress: -1,
          }),
        );
      });

      const playerExam: PlayerExamI = {
        id,
        key: examIndex,
        isActive: active,
        data: playerSeriesMap,
        patientInfo,
      };

      _playerExamMap.set(examIndex, playerExam);
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

    return _playerExamMap;
  };

  const updatePlayerExamMap = (data: PlayerExamMapT) => {
    dispatch({
      type: UPDATE_PLAYER,
      payload: {
        playerExamMap: data,
      },
    });
  };

  /**
   * 通过 序列id获取 播放器序列
   *
   * @param seriesMap
   * @param id
   */
  const getPlayerSeriesById = (playerExam: PlayerExamI, id: string): PlayerSeriesI | undefined => {
    const { data } = playerExam;
    if (!data) return;

    for (const item of data.values()) {
      if (item.id === id) return item;
    }
  };

  /** 更新多个检查的序列 */
  const updateSeries = (datas: PlayerSeriesI[]): void => {
    if (!playerExamMap) return;

    const nextPlayerExamMap = new Map(playerExamMap);
    datas.forEach((data) => {
      const { examKey, key } = data;
      const nextPlayerSeriesMap = setDataToPlayerSeriesMap(playerExamMap, examKey, key, data);
      nextPlayerExamMap.set(examKey, nextPlayerSeriesMap);
    });

    updatePlayerExamMap(nextPlayerExamMap);
  };

  return {
    ...playerReducerData,
    fetchSeriesList,
    updateSeries,
    updatePlayerExamMap,
    cacheSeries,
    initCornerstone,
    initPlayerExamMap,
    getPlayerSeriesById,
  };
};
