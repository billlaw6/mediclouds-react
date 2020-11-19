import React, { FunctionComponent } from "react";
import { IS_MOBILE } from "_constants";
import PlayerWeb from "./Player";

const Player: FunctionComponent = () => {
  if (IS_MOBILE) return <div>移动端播放器即将上线，敬请期待...</div>;
  return <PlayerWeb></PlayerWeb>;
};

export default Player;
