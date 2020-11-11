import { getDicomSeries } from "_api/dicom";
import { PatientExamI } from "_types/api";

import { PlayerDataI, PlayerDataMapT } from "../type";
import cacheDicoms from "./cacheDicoms";

interface InitPropsI {
  cs: any; // cornerstone
  imgLoader: any; // cornerstoneWADOImageLoader
  dicomParser: any; // dicomParser
  examId: string; // 检查id
  defaultSeriesId?: string; // 初始化序列id
  defaultFrame?: number; // 初始化当前序列帧数
  onProgress?: () => void; // 当每个exam加载完成后触发 返回当前计数
  onBeforeCache?: (total: number) => void; // 缓存前触发 total: 当前缓存的总个数
  onAfterCache?: () => void; // 缓存后触发
}

interface InitResI {
  patientInfo: PatientExamI;
  data: PlayerDataMapT;
}

export default async (props: InitPropsI): Promise<InitResI | undefined> => {
  const {
    cs,
    dicomParser,
    imgLoader,
    examId,
    defaultSeriesId,
    defaultFrame = 0,
    onProgress,
    onBeforeCache,
  } = props;

  // 初始化cs相关
  imgLoader.external.dicomParser = dicomParser;
  imgLoader.external.cornerstone = cs;
  imgLoader.configure({
    useWebWorkers: false,
    onloadend: () => onProgress && onProgress(),
  });

  let defaultSeriesIndex = 0; // 默认序列索引
  let patientInfo;
  const data = new Map<number, PlayerDataI>(); // 默认data

  /** 获取序列信息列表 */
  try {
    const dicomSeriesRes = await getDicomSeries(examId);
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
      console.log("_seriesIndex", _seriesIndex);
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
