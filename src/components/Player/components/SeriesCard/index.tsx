import { Avatar } from "antd";
import React, { CSSProperties, FunctionComponent } from "react";
import { PlayerSeriesI } from "_components/Player/types/series";

import "./style.less";

interface SeriesCard {
  data: PlayerSeriesI;
  className?: string;
  style?: CSSProperties;
  active?: boolean; // 激活
  onClick?: (data: PlayerSeriesI) => void;
}

const SeriesCard: FunctionComponent<SeriesCard> = (props) => {
  const { data, className, style, active, onClick } = props;
  const { thumbnail, key, cache } = data;

  return (
    <article
      className={`series-card${className ? ` ${className}` : ""}${active ? " active" : ""}`}
      style={style}
      onClick={(): void => onClick && onClick(data)}
    >
      <Avatar shape="square" className="series-card-avatar" src={thumbnail}></Avatar>
      <div className="series-card-info">
        <span>series index: {key}</span>
        <span>img total: {cache ? cache.length : "null"}</span>
      </div>
    </article>
  );
};

export default SeriesCard;
