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
