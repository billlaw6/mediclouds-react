import { createBrowserHistory } from "history";
import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web/ default to localStorage for web
import createRootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import { decrypt, encrypt } from "_helper";

import rootSaga from "../sagas";

// 此处的History类型必须和Router类型匹配：createHashHistory匹配HashRouter; createBrowerHistory匹配BrowserHistory
// export const history = createHashHistory();
export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const encryptor = createTransform(
  (inboundState, key) => {
    if (!inboundState) return inboundState;
    return encrypt(inboundState);

    // return cryptedText.toString();
  },
  (outboundState, key) => {
    if (!outboundState) return outboundState;
    return decrypt(outboundState as string);
  },
);

const persistConfig = {
  key: "root", // 必须有
  storage, // storage is now required
  // blacklist: ["router"], // reducer里不持久化的数据，不把router剔出来会有刷新跳回原页面的问题。
  whitelist: ["account", "user"], // reducer里持久化的数据
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, createRootReducer);

export default function configureStore(preloadedState?: any) {
  const composeEnhancer: typeof compose =
    (window as any)["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;

  const store = createStore(
    persistedReducer,
    preloadedState,
    composeEnhancer(
      applyMiddleware(
        // routerMiddleware(history), // for dispatching history actions
        // ... other middlewares ...
        sagaMiddleware,
      ),
    ),
  );

  // Hot reloading
  // Property 'hot' does not exist on type 'NodeModule'
  // if ((module as any).hot) {
  //     // Enable Webpack hot module replacement for reducers
  //     module!.hot.accept('./reducers', () => {
  //         store.replaceReducer(createRootReducer(history));
  //     });
  // }

  sagaMiddleware.run(rootSaga);
  const persistor = persistStore(store);

  return { store, persistor };
}
