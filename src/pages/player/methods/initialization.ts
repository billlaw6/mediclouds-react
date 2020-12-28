/**
 * 播放器的初始化操作
 *
 */

import { getSeriesList, PatientExamI } from "mc-api";

import { PlayerDataI, PlayerDataMapT } from "../type";
import cacheDicoms from "./cacheDicoms";

interface InitPropsI {
  cs: any; // cornerstone
  examId: string; // 检查id
  defaultSeriesId?: string; // 初始化序列id
  defaultFrame?: number; // 初始化当前序列帧数
  onBeforeCache?: (total: number) => void; // 缓存前触发 total: 当前缓存的总个数
  onInitCornerstoneTools?: () => void; // 启用cornerstone tools 后触发
}

interface InitResI {
  patientInfo: PatientExamI;
  data: PlayerDataMapT;
}

export default async (props: InitPropsI): Promise<InitResI | undefined> => {
  const { cs, examId, defaultSeriesId, defaultFrame = 0, onBeforeCache } = props;

  let defaultSeriesIndex = 0; // 默认序列索引
  let patientInfo;
  const data = new Map<number, PlayerDataI>(); // 默认data

  /** 获取序列信息列表 */
  try {
    const dicomSeriesRes = await getSeriesList(examId);
    const { children, ...others } = dicomSeriesRes;

    patientInfo = others;

    /** 初始化不含缓存的PlayerData Map */
    children.forEach((item, index) => {
      data.set(
        index,
        Object.assign({}, item, {
          frame: 0,
        }),
      );
    });
    /** 获得初始化序列索引 */
    if (defaultSeriesId) {
      const _seriesIndex = children.findIndex((item) => item.id === defaultSeriesId);
      defaultSeriesIndex = Math.max(_seriesIndex, defaultSeriesIndex);
    }
  } catch (error) {
    throw new Error(error);
  }

  /** 缓存前 */
  const defaultSeries = data.get(defaultSeriesIndex);
  if (!defaultSeries) return;
  onBeforeCache && onBeforeCache(defaultSeries.dicoms.length);

  try {
    /** 缓存当前序列 */
    const cacheRes = await cacheDicoms(cs, defaultSeries.dicoms);
    defaultSeries.cache = cacheRes;
    defaultSeries.frame = defaultFrame;
  } catch (error) {
    throw new Error(error);
  }

  data.set(defaultSeriesIndex, defaultSeries);

  return {
    patientInfo,
    data,
  };
};
