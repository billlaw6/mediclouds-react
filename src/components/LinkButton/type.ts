import { ReactNode } from "react";
import { LinkProps } from "react-router-dom";

export interface LinkButtonPropsI extends LinkProps {
  icon?: string | ReactNode;
  iconPos?: "before" | "after";
  type?: "basic" | "light";
}
