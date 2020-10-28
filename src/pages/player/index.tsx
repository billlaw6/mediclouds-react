import React, { FunctionComponent } from "react";
import PlayerWeb from "./Player";

const IS_MOBILE = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

const Player: FunctionComponent = () => {
  if (IS_MOBILE) return <div>mobile</div>;
  return <PlayerWeb></PlayerWeb>;
};

export default Player;
