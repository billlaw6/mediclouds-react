import React, { FunctionComponent } from "react";
import PlayerWeb from "./Player";
import { RouteComponentProps } from "react-router-dom";

const IS_MOBILE = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

const Player: FunctionComponent<RouteComponentProps<{}, {}, { id: string }>> = (props) => {
  const { id } = props.location.state;

  if (IS_MOBILE) return <div>mobile</div>;
  return <PlayerWeb id={id}></PlayerWeb>;
};

export default Player;
