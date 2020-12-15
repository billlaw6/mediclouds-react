import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { getInfoByDicom } from "_components/Player/helpers";
import { WindowI } from "_components/Player/types/window";
import InfoItem from "./Item";

import "./style.less";

interface InformatinPropsI {
  win: WindowI;
  viewport: any;
}

const Information: FunctionComponent<InformatinPropsI> = (props) => {
  const { win, viewport } = props;

  if (!win || !viewport) return null;

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
          thickness: `ST: ${dicomInfo.series.thickness ? `${dicomInfo.series.thickness}mm` : "NA"}`,
          sliceLocation: `SL: ${dicomInfo.series.location || "NA"}`,
          pixelSpacing: `pixelSpace: ${dicomInfo.series.pixelSpacing || "NA"}`,
        }}
        position="br"
      ></InfoItem>
    </section>
  );
};

export default Information;
