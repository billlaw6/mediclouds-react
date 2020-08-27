import { ActionI } from "./core";

export interface ReducerI<S, T = any, P = any> {
  (state: S, action: ActionI<T, P>): S;
}
