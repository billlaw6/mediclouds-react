import { combineReducers } from "redux";
// import user from "./user";
import account from "./account";
import resources from "./resources";
import settings from "./settings";
import aiReport from "./aiReport";
import prod from "./product";
import cases from "./case";

export default combineReducers({
  resources,
  settings,
  account,
  aiReport,
  prod,
  cases,
});
