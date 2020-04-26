import { LoginFormI, UserI } from "_constants/interface";
import { SetUserActionFuncT } from "_actions/user";

export interface MapStateToPropsI {
  // router: { location: Location };
  // loginForm: LoginFormI;
  user: UserI;
}

export interface MapDispatchToPropsI {
  // setWeChatCodeAction: SetWeChatCodeActionFuncI;
  // setLoginFormAction: SetLoginFormActionFuncT;
  // submitLoginFormAction: SubmitLoginFormActionFuncT;
  // setCurrentUserAction: SetCurrentUserActionFuncT;
  setUserAction: SetUserActionFuncT;
}

export interface FieldsI {
  username: {
    value: string;
  };
  password: {
    value: string;
  };
  remember: {
    value: boolean;
  };
  messages: {
    value: Array<string>;
  };
}
