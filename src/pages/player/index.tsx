import React, { FunctionComponent } from "react";
import Player from "_components/Player";
import useUrlQuery from "_hooks/useUrlQuery";
import { QueryDataI } from "./type";

const PlayerPage: FunctionComponent = () => {
  /** 获取url中的query */
  const { exam: id, series: originSeriesId, frame: originImgIndex } = useUrlQuery<QueryDataI>();

  return <Player id={id} defaultFrame={originImgIndex} defaultSeries={originSeriesId}></Player>;
};

export default PlayerPage;
