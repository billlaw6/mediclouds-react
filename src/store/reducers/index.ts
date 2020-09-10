import { combineReducers } from "redux";
import { History } from "history";
import { connectRouter } from "connected-react-router";
import user from "./user";
import account from "./account";
import { examIndexListReducer } from "./dicom";
import dicomSettings from "./dicomSettings";

// 每个reducer必须都返回state类型的数据！
const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    // token: tokenReducer,
    user,
    examIndexList: examIndexListReducer,
    dicomSettings,
    account,
  });

// IState不能作为组件创建时props类型！！！必须用store.d里定义的！三天的教训！
// export type IState = ReturnType<typeof createRootReducer>

export default createRootReducer;
