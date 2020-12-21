import React, { FunctionComponent, lazy, Suspense } from "react";
// import Player from "_components/Player";
// import OldPlayer from "./Player";
import useSettings from "_components/Player/hooks/useSettings";
import useUrlQuery from "_hooks/useUrlQuery";
import { QueryDataI } from "./type";
import DefalutLayout from "_layout/Default/Default";

const NewPlayer = lazy(() => import("_components/Player"));
const OldPlayer = lazy(() => import("./Player"));

const PlayerPage: FunctionComponent = () => {
  /** 获取url中的query */
  const {
    exam: id,
    series: originSeriesId,
    frame: originImgIndex = 0,
    lungnodule,
  } = useUrlQuery<QueryDataI>();

  const { isNewPlayer } = useSettings();

  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, .5)",
            color: "#fff",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
          }}
        >
          加载播放器...
        </div>
      }
    >
      {isNewPlayer ? (
        <NewPlayer
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
        ></NewPlayer>
      ) : (
        <DefalutLayout>
          <OldPlayer
            exam={id}
            series={originSeriesId}
            index={originImgIndex}
            lungnodule={typeof lungnodule === "string" ? parseInt(lungnodule, 10) : lungnodule}
          ></OldPlayer>
        </DefalutLayout>
      )}
    </Suspense>
  );
};

export default PlayerPage;
