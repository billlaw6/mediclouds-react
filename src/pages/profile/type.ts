import { UserI } from "_constants/interface";
import { UpdateUserActionFuncT } from "_actions/user";

export interface MapStateToPropsI {
  user: UserI;
}
export interface MapDispatchToPropsI {
  updateUserAction: UpdateUserActionFuncT;
}
