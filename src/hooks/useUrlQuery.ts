import { useLocation } from "react-router";

/**
 * 获取url内传递的参数
 * @return {object} params
 */
export default <T = any>(): any => {
  const location = useLocation();
  const search = location.search.substring(1);
  const param: { [key: string]: any } = {};
  const arr = search.split("&");

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i].split("=");
    if (!item[0]) continue;
    param[item[0]] = decodeURIComponent(item[1]);
  }

  return param as T;
};
