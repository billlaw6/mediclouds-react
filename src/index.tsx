/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./store";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { IntlProvider } from "react-intl";
import zh_CN from "./locales/zh_CN";
import en_US from "./locales/en_US";
import { PersistGate } from "redux-persist/integration/react";
import wechatQrcode from "_images/wechat-qrcode.jpg";
import { publicApi, personalApi } from "mc-api";
import { BASE_URL } from "_config";

/* 
  为使用Antd的datePicker组件，需要正确设置国际化（针对antd组件）
*/
// 引入所需组件和国际化文件
import { ConfigProvider } from "antd";
import locale from "antd/es/locale/zh_CN";

/* mock */
// import "./mock";

import "core-js/stable";
import "regenerator-runtime/runtime";

export const store = configureStore();
// const persistor = persistStore(store);

const handleErr = (err: any) => {
  const { response, message } = err;
  console.log("err response", response);
  if (response) {
    const { baseURL, status, data, url, statusText } = response;

    switch (status) {
      case 401:
      case 403:
        window.localStorage.clear();
        window.location.href = "/login";
        break;
      default:
        break;
    }
  }
};

publicApi.setBaseUrl(BASE_URL);
publicApi.setHandleResErr(handleErr);
personalApi.setBaseUrl(BASE_URL);
personalApi.setHandleResErr(handleErr);

// 下面两种模式有区别，原因未知。
// let messages = {
//     en: zh_CN,
//     zh: en_US,
// }
const messages = {
  en: {},
  zh: {},
};
messages["en"] = en_US;
messages["zh"] = zh_CN;

// 将store传入app根结点，与整个生命周期绑定
// 初始数据在各个reducer中，通过configureStore整合进来，
// 又在各组件中通过mapStateToProps取走各组件需要的部分。
if (module.hot) {
  console.log("hot");
}

const Loading = () => <div>loading</div>;

// const IS_MOBILE = false;
const IS_MOBILE = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
const MobileHome: FunctionComponent = () => (
  <div className="mobile-tip">
    <div className="mobile-tip-content">
      <img src={wechatQrcode} alt="wechat_qrcode" title="wechat-qrcode"></img>
      <p>请用微信扫码即刻体验医影小程序</p>
    </div>
  </div>
);

const ignoreArr: string[] = ["register", "public-ct", "e", "player", "login"];
// const ignoreArr = ["affiliate", "player"];
const { pathname } = window.location;
const showMobilePage = ignoreArr.every((item) => pathname.indexOf(item) < 0);

ReactDOM.render(
  IS_MOBILE && showMobilePage ? (
    <MobileHome />
  ) : (
    <Provider store={store.store}>
      <IntlProvider locale="zh" messages={messages["zh"]}>
        <PersistGate loading={null} persistor={store.persistor}>
          <ConfigProvider locale={locale}>
            <App />
          </ConfigProvider>
        </PersistGate>
      </IntlProvider>
    </Provider>
  ),
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
