/*
 * 定义全局配置
 */

const { NODE_ENV } = process.env;

const isDev = NODE_ENV === "development";

// const DEV_URL = "http://115.29.148.227:8083";
const DEV_URL = "http://192.168.31.252:8083";
// const DEV_URL = "";
const PROD_URL = "https://mi.mediclouds.cn";
// const BASE_URL = isDev ? DEV_URL : PROD_URL;
export const BASE_URL = isDev ? DEV_URL : PROD_URL;

export default {
  personalBaseUrl: `${BASE_URL}/rest-api`,
  publicBaseUrl: `${BASE_URL}/public-api`,
  registerBaseUrl: `${BASE_URL}/register`,
  wechatPayBaseUrl: `${BASE_URL}/pay`,
  isMaintenance: false, // 是否在维护状态
  scoreDiscount: 2, // 积分充值优惠
};
