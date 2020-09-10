import { CustomerI } from "_types/account";
import { RouteComponentProps } from "react-router";

export interface MapStateToPropsI {
  user: CustomerI;
}

export type DashboardPropsI = MapStateToPropsI & RouteComponentProps;
export interface DashboardStateI {
  openKeys: string[];
}
