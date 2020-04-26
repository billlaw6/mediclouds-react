import { createBrowserHistory, createHashHistory } from "history";
import { createStore, applyMiddleware, compose } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default to localStorage for web
import { routerMiddleware } from "connected-react-router";
import createRootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas";

// 此处的History类型必须和Router类型匹配：createHashHistory匹配HashRouter; createBrowerHistory匹配BrowserHistory
// export const history = createHashHistory();
export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "root", // 必须有
  storage, // storage is now required
  blacklist: ["router"], // reducer里不持久化的数据，不把router剔出来会有刷新跳回原页面的问题。
  // whitelist: ['token'],   // reducer里持久化的数据
};

export default function configureStore(preloadedState?: any) {
  const composeEnhancer: typeof compose =
    (window as any)["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;

  const store = createStore(
    persistReducer(persistConfig, createRootReducer(history)),
    // createRootReducer(history), // root reducer with router state
    preloadedState,
    composeEnhancer(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
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
  return store;
}
