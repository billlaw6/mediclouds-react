import { GetSearchQueryPropsI, UserI } from "_types/api";
import { RouteComponentProps } from "react-router";

export interface MapStateToPropsI {
  user: UserI;
}

export type UserManagePropsI = MapStateToPropsI & RouteComponentProps;
export interface UserManageStateI {
  userList: UserI[];
  searchResult: UserI[];
  selectedRowKeys: string[];
  userTotal: number;
  searchQuery: GetSearchQueryPropsI;
}
