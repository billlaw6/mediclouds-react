import React, { FunctionComponent } from "react";
import { getInfoByDicom } from "_components/Player/helpers";
import { WindowI } from "_components/Player/types/window";
import InfoItem from "./Item";

import "./style.less";

interface InformatinPropsI {
  win: WindowI;
}

const Information: FunctionComponent<InformatinPropsI> = (props) => {
  const { win } = props;
  const { data: playerSeries, frame } = win;
  if (!playerSeries) return null;
  const { cache } = playerSeries;
  if (!cache) return null;

  const currentImg = cache[frame];
  if (!currentImg) return null;

  const dicomInfo = getInfoByDicom(currentImg);

  return (
    <section className="player-info">
      <InfoItem data={dicomInfo.study}></InfoItem>
      <InfoItem data={dicomInfo.patient} position="tr"></InfoItem>
    </section>
  );
};

export default Information;
