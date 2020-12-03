/**
 * 用cs缓存DICOM文件
 *
 * @param {any} cs cornerstone
 * @param {string[]} dicomUrls dicom地址数组
 * @param {Function} [onBefore] 缓存之前触发
 * @returns {Promise<any[]>} 返回cs相关数组
 */
export default async (
  dicomUrls: string[],
  cs: any,
  csImgLoader: any,
  onBefore?: (total: number) => void,
): Promise<any[]> => {
  const processes: Promise<any>[] = [];
  onBefore && onBefore(dicomUrls.length || 1);

  let loadImgUrls: string[] = dicomUrls;

  try {
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
    dicomUrls.forEach((url) => {
      csImgLoader.wadouri.dataSetCacheManager.unload(url);
    });

    return res;
  } catch (error) {
    throw new Error(error);
  }
};
