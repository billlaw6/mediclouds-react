import React, { FunctionComponent } from "react";
import Player from "_components/Player";
import useUrlQuery from "_hooks/useUrlQuery";
import { QueryDataI } from "./type";

const PlayerPage: FunctionComponent = () => {
  /** 获取url中的query */
  const { exam: id, series: originSeriesId, frame: originImgIndex = 0 } = useUrlQuery<QueryDataI>();

  return (
    <Player
      exams={[{ id, defaultFrame: originImgIndex, defaultSeriesId: originSeriesId, active: true }]}
    ></Player>
  );
};

export default PlayerPage;
