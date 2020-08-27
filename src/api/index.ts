import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "qs";
import { history } from "../store/configureStore";
import { store } from "../index";
import config from "_config";

// let store = configureStore();
let requestName: string; // 每次发起请求都会携带这个参数，用于标识这次请求，如果值相等，则取消重复请求

// switch (process.env.NODE_ENV) {
//   case "development":
//     axios.defaults.baseURL = "http://192.168.31.252:8083/rest-api/";
//     // axios.defaults.baseURL = "https://mi.mediclouds.cn/rest-api/";

//     break;
//   case "production":
//     axios.defaults.baseURL = "https://mi.mediclouds.cn/rest-api/";
//     break;
//   default:
//     axios.defaults.baseURL = "rest-api/";
//     break;
// }

const axiosBaseConfig: AxiosRequestConfig = {
  // 自定义响应成功的HTTP状态码
  validateStatus: (status): boolean => {
    return /^(2|3)\d{2}$/.test(status.toString());
  },
  headers: {
    post: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  },
};

const _personalApi = axios.create(
  Object.assign({}, axiosBaseConfig, {
    baseURL: config.personalBaseUrl,
  }),
);

const _publicApi = axios.create(
  Object.assign({}, axiosBaseConfig, {
    baseURL: config.publicBaseUrl,
  }),
);

/* 自定义请求拦截器 */
const customReq = (config: AxiosRequestConfig) => {
  // config 代表发起请求的参数的实体(可以发起一个请求在控制台打印一下这个config看看是什么东西)
  // 得到参数中的 requestName 字段，用于决定下次发起请求，取消对应的 相同字段的请求
  // 如果没有 requestName 就默认添加一个 不同的时间戳
  config.headers["X-Requested-With"] = "XMLHttpRequest";
  const regex = /.*csrftoken=([^;.]*).*$/; // 用于从cookies中匹配csrftoken值
  config.headers["X-CSRFToken"] =
    document.cookie.match(regex) === null ? null : document.cookie.match(regex)![1];
  // localStorage在这里有点不及时
  // const persistRoot = JSON.parse(localStorage.getItem("persist:root")!);
  // if (persistRoot.token && persistRoot.token.length > 2) {
  //   console.log("Token " + JSON.parse(persistRoot.token));
  //   config.headers.Authorization = "Token " + JSON.parse(persistRoot.token);
  // }
  const token = store.getState().token;
  console.log("token", token);
  if (token) {
    console.log("Token " + token);
    config.headers.Authorization = "Token " + token;
  }

  if (config.method === "post") {
    // console.log(config.data);
    // console.log(qs.parse(config.data));
    if (config.data && qs.parse(config.data).requestName) {
      requestName = qs.parse(config.data).requestName as string;
    } else {
      requestName = new Date().getTime().toString();
    }
  } else {
    if (config.params && config.params.requestName) {
      //如果请求参数中有这个requestName标识，则赋值给上面定义的requestName
      requestName = config.params.requestName;
    } else {
      requestName = new Date().getTime().toString();
    }
  }
  // 判断，如果这里拿到的参数中的 requestName 在上一次请求中已经存在，就取消上一次的请求
  // if (requestName) {
  //     if (axios.get(requestName) && axios.get(requestName).cancel ) {
  //         axios.get(requestName).cancel('取消了请求');
  //     }
  //     config.cancelToken = new axios.CancelToken((c: any) => {
  //         axios.get(requestName) = {};
  //         axios.get(requestName).cancel = c; //取消请求操作
  //     });
  // }
  return config;
};
const customReqErr = (err: any) => Promise.reject(err);

/* 自定义响应拦截器 */

// 服务器返回了结果，有前面的validateStatus保证，这里接收的只会是2和3开着的状态
const customRes = (res: AxiosResponse<any>) => res.data;
const customResErr = (error: any) => {
  // 两种错误返回类型
  const { response } = error;
  console.log(response);
  // if (response) {
  //   // 服务器返回了结果
  //   // console.log('response valid');
  //   switch (response.status) {
  //     case 400:
  //       // history.push("/login");
  //       return Promise.reject(error);
  //     case 401: // 当前请求用户需要验证，未登录；
  //       // 跳转路由或弹出蒙层
  //       // 直接修改localStorage会被redux-persist还原
  //       // delete persistRoot.token;
  //       // console.log(persistRoot);
  //       // localStorage.setItem('persist:root', JSON.stringify(persistRoot));
  //       // localStorage.setItem('persist:root', persistRoot);
  //       history.push("/login");
  //       return Promise.reject(error);
  //     case 403: // 服务器拒绝执行，通常是token过期；
  //       // 直接修改localStorage会被redux-persist还原
  //       // persistRoot.token = '';
  //       // console.log(persistRoot);
  //       // localStorage.setItem('persist:root', JSON.stringify(persistRoot));
  //       // history.push("/login");
  //       return Promise.reject(error);
  //     case 404: // 资源找不到；
  //       // history.push("/404");
  //       return Promise.reject(error);
  //     default:
  //       return Promise.reject(error);
  //   }
  // } else {
  //   if (!window.navigator.onLine) {
  //     // 断网处理：可以跳转到断网页面
  //     history.push("/offline");
  //     return Promise.reject(error);
  //   }
  //   // 服务器无响应又没断网，返回报错
  //   // history.push("/error");
  //   return Promise.reject(error);
  // }
};

_personalApi.interceptors.request.use(customReq, customReqErr);
_publicApi.interceptors.request.use(customReq, customReqErr);

_personalApi.interceptors.response.use(customRes, customResErr);
_publicApi.interceptors.response.use(customRes, customResErr);

export const personalApi = _personalApi;
export const publicAPi = _publicApi;
