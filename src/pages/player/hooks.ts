import { useState } from "react";
import { PatientExamI } from "_types/api";
import { PlayerDataI, PlayerDataMapT } from "./type";

/**
 * 获取url内传递的参数
 *
 * @template T 返回的值类型
 * @param {string} [url] 解析的地址 如果不填则为当前页面url
 * @returns {*}
 */
export const useUrlQuery = <T = any>(url?: string): any => {
  const search = url ? url.split("?")[1] : window.location.search.substring(1);
  const param: { [key: string]: any } = {};
  const arr = search.split("&");

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i].split("=");
    if (!item[0]) continue;
    param[item[0]] = decodeURIComponent(item[1]);
  }

  return param as T;
};

/**
 * 播放器数据资源
 */
export const useData = () => {
  const [patientInfo, setPatientInfo] = useState<PatientExamI>(); // 病人信息
  const [data, setData] = useState<PlayerDataMapT>(); // 播放器的数据Map
  const [seriesIndex, setSeriesIndex] = useState(0); // 当前series的索引

  const updateDataByIndex = (index: number, nextData: PlayerDataI): void => {
    const _data = data ? new Map(data) : new Map();
    _data.set(index, nextData);
    setData(_data);
  };

  /* 获取当前PlayerData */
  const getCurrentData = (): PlayerDataI | undefined => {
    if (!data) return undefined;
    return data.get(seriesIndex);
  };

  return {
    data,
    patientInfo,
    seriesIndex,
    setData,
    setPatientInfo,
    setSeriesIndex,
    updateDataByIndex,
    getCurrentData,
  };
};

/**
 * 播放控制
 * 下一帧｜上一帧｜第一帧｜最后一帧
 * 上一个序列｜下一个序列｜第一个序列｜最后一个序列
 * 播放｜暂停
 */
export const usePlayController = (props: any) => {
  const { data, seriesIndex, setSeriesIndex, updateDataByIndex, getCurrentData } = props;

  /* 第一帧 */
  const first = (): void => {
    const currentData = getCurrentData();
    if (!currentData || !currentData.cache) return;

    updateDataByIndex(seriesIndex, Object.assign({}, currentData, { frame: 0 }));
  };

  /* 最后一帧 */
  const last = (): void => {
    const currentData = getCurrentData();
    if (!currentData || !currentData.cache) return;

    updateDataByIndex(
      seriesIndex,
      Object.assign({}, currentData, { frame: currentData.cache.length - 1 }),
    );
  };

  /** 下一帧 */
  const next = (): void => {
    const currentData = getCurrentData();
    if (!currentData) return;
    const { cache, frame } = currentData;
    if (!cache) return;

    updateDataByIndex(
      seriesIndex,
      Object.assign({}, currentData, { frame: Math.min(frame + 1, cache.length - 1) }),
    );
  };

  /** 上一帧 */
  const prev = (): void => {
    const currentData = getCurrentData();
    if (!currentData) return;
    const { cache, frame } = currentData;
    if (!cache) return;

    updateDataByIndex(
      seriesIndex,
      Object.assign({}, currentData, { frame: Math.max(0, frame - 1) }),
    );
  };

  /* 第一个序列 */
  const firstSeries = (): void => setSeriesIndex(0);
  /* 最后一个序列 */
  const lastSeries = (): void => data && setSeriesIndex(data.size - 1);

  /* 下一个序列 */
  const nextSeries = (): void => {
    if (!data) return;
    const maxIndex = data.size - 1;
    setSeriesIndex(Math.min(maxIndex, seriesIndex + 1));
  };
  /* 上一个序列 */
  const prevSeries = (): void => {
    if (!data) return;
    setSeriesIndex(Math.max(0, seriesIndex - 1));
  };

  return { prev, next, first, last, firstSeries, lastSeries, nextSeries, prevSeries };
};
