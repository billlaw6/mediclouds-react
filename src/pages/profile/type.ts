import { UserI } from "_types/api";
import { UpdateUserActionFuncT } from "_actions/user";

export interface MapStateToPropsI {
  user: UserI;
}
export interface MapDispatchToPropsI {
  updateUserAction: UpdateUserActionFuncT;
}
