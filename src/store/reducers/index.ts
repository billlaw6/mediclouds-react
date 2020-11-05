import { combineReducers } from "redux";
// import user from "./user";
import account from "./account";
import resources from "./resources";
import dicomSettings from "./dicomSettings";
import aiReport from "./aiReport";

export default combineReducers({
  resources,
  resourcesSettings: dicomSettings,
  account,
  aiReport,
});
