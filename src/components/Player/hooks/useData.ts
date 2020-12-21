import { useDispatch, useSelector } from "react-redux";
import { LungNoduleReportI } from "_types/ai";
import { StoreStateI } from "_types/core";
import { setDataToPlayerSeriesMap } from "../helpers";
import fetchExamList from "../methods/fetchExamList";
import fetchLungNoduleReport from "../methods/fetchLungNoduleReport";
import fetchSeriesList from "../methods/fetchSeriesList";
import initCornerstone from "../methods/initCornerstone";

import { PlayerActionE } from "../types/actions";
import { PlayerExamPropsI } from "../types/common";
import { PlayerExamI, PlayerExamMapT } from "../types/exam";
import { PlayerSeriesI, PlayerSeriesMapT } from "../types/series";

const {
  UPDATE_PLAYER,
  INIT_PLAYER,
  INIT_LUNG_NODULE_REPORT,
  UPDATE_PLAYER_EXAM_MAP,
  UPDATE_CURRENT_LUNG_NODULES_REPORT,
} = PlayerActionE;

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

    const examListRes = await fetchExamList(exams);
    const _playerExamMap: PlayerExamMapT = new Map();

    /** 构建CollectionMap */
    exams.forEach((exam, examIndex) => {
      const { id, active, defaultFrame = 0 } = exam;
      const { children, anonymous_flag } = examListRes[examIndex];
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
        isAnonymous: !!anonymous_flag,
      };

      _playerExamMap.set(examIndex, playerExam);
    });

    dispatch({
      type: INIT_PLAYER,
      payload: {
        cs,
        cst,
        csImgLoader,
        examList: examListRes,
        playerExamMap: _playerExamMap,
      },
    });

    return _playerExamMap;
  };

  /** 初始化肺结节筛查报告 */
  const initLungNoduleMap = async (exams: PlayerExamPropsI[]): Promise<void> => {
    const lungNoduleReportMap = await fetchLungNoduleReport(
      exams.filter((item) => !!item.defaultLungNodule),
    );
    if (lungNoduleReportMap && lungNoduleReportMap.size) {
      dispatch({ type: INIT_LUNG_NODULE_REPORT, payload: lungNoduleReportMap });
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

  const getPlayerSeries = (examKey: number, key: number): PlayerSeriesI | undefined => {
    if (!playerExamMap) return;
    const currentExam = playerExamMap.get(examKey);
    if (!currentExam || !currentExam.data) return;

    return currentExam.data.get(key);
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

  /**
   * 更新某个series
   */
  const updateSeries = (examkey: number, key: number, data: { [key: string]: any }): void => {
    if (!playerExamMap) return;
    const currentExam = playerExamMap.get(examkey);
    if (!currentExam) return;

    const targetSeries = currentExam.data.get(key);
    if (!targetSeries) return;

    for (const dataKey of Object.keys(data)) {
      const val = data[dataKey];
      targetSeries[dataKey] = val;
    }

    currentExam.data.set(key, targetSeries);
    playerExamMap.set(examkey, currentExam);

    dispatch({ type: UPDATE_PLAYER_EXAM_MAP, payload: playerExamMap });
  };

  /** 更新多个检查的序列 */
  const updateSeriesArr = (datas: PlayerSeriesI[]): void => {
    if (!playerExamMap) return;

    const nextPlayerExamMap = new Map(playerExamMap);
    datas.forEach((data) => {
      const { examKey, key } = data;
      const nextPlayerSeriesMap = setDataToPlayerSeriesMap(playerExamMap, examKey, key, data);
      nextPlayerExamMap.set(examKey, nextPlayerSeriesMap);
    });

    updatePlayerExamMap(nextPlayerExamMap);
  };

  const updateLungNodulesReport = (examKey: number, report?: LungNoduleReportI): void => {
    dispatch({ type: UPDATE_CURRENT_LUNG_NODULES_REPORT, payload: { examKey, report } });
  };

  const clearPlayerData = (): void => {
    dispatch({ type: PlayerActionE.CLEAR });
  };

  return {
    ...playerReducerData,
    fetchSeriesList,
    updateSeries,
    updateSeriesArr,
    updatePlayerExamMap,
    cacheSeries,
    initCornerstone,
    initPlayerExamMap,
    initLungNoduleMap,
    getPlayerSeries,
    getPlayerSeriesById,
    updateLungNodulesReport,
    clearPlayerData,
  };
};
