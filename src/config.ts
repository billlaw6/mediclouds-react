/*
 * 定义全局配置
 */

const { NODE_ENV } = process.env;

const DEV_URL = "192.168.31.75:8080";
const PROD_URL = "https://mi.mediclouds.cn";
const BASE_URL = NODE_ENV === "development" ? DEV_URL : PROD_URL;

export default {
  personalBaseUrl: `${BASE_URL}/rest-api`,
  publicBaseUrl: `${BASE_URL}/public-api`,
};
