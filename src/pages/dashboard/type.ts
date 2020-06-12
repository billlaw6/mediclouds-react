import { UserI } from "_constants/interface";
import { RouteComponentProps } from "react-router";

export interface MapStateToPropsI {
  user: UserI;
}

export type DashboardPropsI = MapStateToPropsI & RouteComponentProps;
export interface DashboardStateI {
  openKeys: string[];
}
