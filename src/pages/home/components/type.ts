import { UserI } from "_constants/interface";
import { SetUserActionFuncT } from "_actions/user";

export interface MapStateToPropsI {
  user: UserI;
}

export interface MapDispatchToPropsI {
  setUserAction: SetUserActionFuncT;
}

export interface PrivacyNoticeStateI {
  onChecked: Function;
}

export type PrivacyNoticePropsI = MapStateToPropsI & MapDispatchToPropsI & PrivacyNoticeStateI;
