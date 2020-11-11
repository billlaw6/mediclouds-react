/**
 * 用cs缓存DICOM文件
 *
 * @param {any} cs cornerstone
 * @param {string[]} dicomUrls dicom地址数组
 * @param {Function} [onBefore] 缓存之前触发
 * @returns {Promise<any[]>} 返回cs相关数组
 */
export default async (
  cs: any,
  dicomUrls: string[],
  onBefore?: (total: number) => void,
): Promise<any[]> => {
  const processes: Promise<any>[] = [];
  onBefore && onBefore(dicomUrls.length || 1);

  dicomUrls.forEach((url) => {
    processes.push(cs.loadImage(`wadouri:${url}`));
  });

  return await Promise.all(processes);
};
