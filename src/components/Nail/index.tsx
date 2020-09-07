import React, { FunctionComponent, ReactNode } from "react";
import { Tag } from "antd";
import { MatchSwitchRuleI, matchSwitchRules } from "_helper";

export interface NailItemI {
  text: string;
  icon?: ReactNode;
  color?: string;
}

interface NailPropsI {
  rules: MatchSwitchRuleI<NailItemI>[];
  target: string;
}

const Nail: FunctionComponent<NailPropsI> = (props) => {
  const { rules, target } = props;

  const nailConfig = matchSwitchRules<NailItemI>(rules, target);

  if (!nailConfig) return null;

  const { color, icon, text } = nailConfig;

  return (
    <Tag color={color} icon={icon}>
      {text}
    </Tag>
  );
};

export default Nail;
