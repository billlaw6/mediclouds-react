import React, { FunctionComponent, lazy, Suspense } from "react";
import useSettings from "_components/Player/hooks/useSettings";
import useUrlQuery from "_hooks/useUrlQuery";
import { QueryDataI } from "./type";
import DefalutLayout from "_layout/Default/Default";
import { useHistory } from "react-router";
import logo from "_images/logo.png";
import customerService from "_images/xiaoying-wechat-qrcode.png";
import { IS_MOBILE } from "_constants";

const NewPlayer = lazy(() => import("mc-browser"));
const OldPlayer = lazy(() => import("./Player"));

const PlayerPage: FunctionComponent = () => {
  /** 获取url中的query */
  const history = useHistory();
  const { switchPlayerVersion } = useSettings();
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
          加载浏览器...
        </div>
      }
    >
      {isNewPlayer || IS_MOBILE ? (
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
          onClickBackBtn={() => history.push("/resources")}
          onClickOldVersionBtn={() => {
            switchPlayerVersion(false);
          }}
          logo={logo}
          customerService={customerService}
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
