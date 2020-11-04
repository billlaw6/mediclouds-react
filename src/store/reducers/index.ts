import { combineReducers } from "redux";
// import user from "./user";
import account from "./account";
import resources from "./resources";
import dicomSettings from "./dicomSettings";

// IState不能作为组件创建时props类型！！！必须用store.d里定义的！三天的教训！
// export type IState = ReturnType<typeof createRootReducer>

export default combineReducers({
  resources,
  resourcesSettings: dicomSettings,
  account,
});
