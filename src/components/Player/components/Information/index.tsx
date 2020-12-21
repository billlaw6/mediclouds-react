import React, { FunctionComponent } from "react";
import { getInfoByDicom } from "_components/Player/helpers";
import useData from "_components/Player/hooks/useData";
import { WindowI } from "_components/Player/types/window";
import InfoItem from "./Item";

import "./style.less";

interface InformatinPropsI {
  win: WindowI;
  viewport: any;
}

const Information: FunctionComponent<InformatinPropsI> = (props) => {
  const { win, viewport } = props;
  const { playerExamMap } = useData();

  if (!win || !viewport || !playerExamMap) return null;

  const { data: playerSeries, frame } = win;
  if (!playerSeries) return null;
  const { cache, examKey } = playerSeries;
  const currentExam = playerExamMap.get(examKey);
  if (!cache || !currentExam) return null;

  const currentImg = cache[frame];
  if (!currentImg) return null;

  const { isAnonymous } = currentExam;

  const dicomInfo = getInfoByDicom(currentImg);

  if (isAnonymous) {
    dicomInfo.hospital.name = "Anonymous";
    dicomInfo.patient.name = "Anonymous";
    dicomInfo.patient.birthday = "Anonymous";
    dicomInfo.patient.age = "Anonymous";
    dicomInfo.patient.id = "Anonymous";
  }

  return (
    <section className="player-info">
      <InfoItem data={{ ...dicomInfo.study, ...dicomInfo.hospital }}></InfoItem>
      <InfoItem data={dicomInfo.patient} position="tr"></InfoItem>
      <InfoItem
        data={{
          frame: `image: ${frame + 1}/${cache.length}`,
          zoom: `zoom: ${Math.round(viewport.scale * 100) / 100}`,
          wwwc: `WW:${Math.round(viewport.voi.windowWidth)} WL:${Math.round(
            viewport.voi.windowCenter,
          )}`,
        }}
        position="bl"
      ></InfoItem>
      <InfoItem
        data={{
          stSl: `ST: ${dicomInfo.series.thickness ? `${dicomInfo.series.thickness}mm` : "NA"} SL: ${
            dicomInfo.series.location || "NA"
          }`,
          // pixelSpacing: `pixelSpace: ${dicomInfo.series.pixelSpacing || "NA"}`,
        }}
        position="br"
      ></InfoItem>
    </section>
  );
};

export default Information;
