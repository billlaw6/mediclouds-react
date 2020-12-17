import React, { FunctionComponent } from "react";
import Player from "_components/Player";
import OldPlayer from "./Player";
import useSettings from "_components/Player/hooks/useSettings";
import useUrlQuery from "_hooks/useUrlQuery";
import { QueryDataI } from "./type";
import DefalutLayout from "_layout/Default/Default";

const PlayerPage: FunctionComponent = () => {
  /** 获取url中的query */
  const {
    exam: id,
    series: originSeriesId,
    frame: originImgIndex = 0,
    lungnodule,
  } = useUrlQuery<QueryDataI>();

  const { isNewPlayer } = useSettings();

  return isNewPlayer ? (
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
  ) : (
    <DefalutLayout>
      <OldPlayer
        exam={id}
        series={originSeriesId}
        index={originImgIndex}
        lungnodule={typeof lungnodule === "string" ? parseInt(lungnodule, 10) : lungnodule}
      ></OldPlayer>
    </DefalutLayout>
  );
};

export default PlayerPage;
