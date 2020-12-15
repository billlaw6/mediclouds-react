import React, { FunctionComponent } from "react";
import Player from "_components/Player";
import useUrlQuery from "_hooks/useUrlQuery";
import { QueryDataI } from "./type";

const PlayerPage: FunctionComponent = () => {
  /** 获取url中的query */
  const {
    exam: id,
    series: originSeriesId,
    frame: originImgIndex = 0,
    lungnodule,
  } = useUrlQuery<QueryDataI>();

  return (
    <Player
      exams={[
        {
          id,
          defaultFrame: parseInt(originImgIndex, 10),
          defaultSeriesId: originSeriesId,
          active: true,
          defaultLungNodule: !!lungnodule,
        },
      ]}
      backTo="/resources"
    ></Player>
  );
};

export default PlayerPage;
