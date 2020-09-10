import { CustomerI } from "_types/account";
import { UpdateUserActionFuncT } from "_actions/user";

export interface MapStateToPropsI {
  user: CustomerI;
}
export interface MapDispatchToPropsI {
  updateUserAction: UpdateUserActionFuncT;
}
