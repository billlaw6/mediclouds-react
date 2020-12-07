import { PlayerSeriesI } from "../types";

interface CachePropsI {
  cs: any;
  csImgLoader: any;
  data?: PlayerSeriesI;
  onBeforeCache?: (data: PlayerSeriesI) => void; // 缓存前触发 返回当前DataI
  onCaching?: (progress: number, data: PlayerSeriesI) => void; // 缓存中触发 返回百分比进度
  onCached?: (data: PlayerSeriesI) => void; // 缓存后触发 返回当前DataI
}

/**
 * 用cs缓存DICOM文件
 *
 * @param {any} cs cornerstone
 * @param {PlayerSeriesI[]} data dicomI
 * @param {Function} [onBefore] 缓存之前触发
 * @returns {Promise<any[]>} 返回cs相关数组
 */
export default async (props: CachePropsI): Promise<any[]> => {
  const { cs, csImgLoader, data, onBeforeCache, onCached, onCaching } = props;

  const processes: Promise<any>[] = [];
  if (!data) return [];

  const { dicoms, id } = data;

  let loadImgUrls: string[] = dicoms;

  const onProgress = (event: any) => {
    const { detail } = event;
    const { total, loaded } = detail;

    onCaching && onCaching(Math.round((loaded * 100) / total), data);
  };

  cs.events.addEventListener("cornerstoneimageloadprogress", onProgress);

  try {
    onBeforeCache && onBeforeCache(data);

    if (loadImgUrls.length === 1) {
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
    }

    loadImgUrls = loadImgUrls.map((url) => `wadouri:${url}`);

    loadImgUrls.forEach((url) => {
      processes.push(cs.loadAndCacheImage(url));
    });

    const res = await Promise.all(processes);
    dicoms.forEach((url) => {
      csImgLoader.wadouri.dataSetCacheManager.unload(url);
    });

    cs.events.removeEventListener("cornerstoneimageloadprogress", onProgress);

    onCached && onCached(data);

    return res;
  } catch (error) {
    throw new Error(error);
  }
};
