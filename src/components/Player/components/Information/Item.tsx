import React, { FunctionComponent } from "react";

interface InfoItemPropsI {
  data: {
    [key: string]: any;
  };
  position?: "tl" | "tr" | "bl" | "br";
}

const InfoItem: FunctionComponent<InfoItemPropsI> = (props) => {
  const { data, position = "tl" } = props;

  return (
    <article className={`player-info-item ${position}`}>
      <ul className="player-info-item-list">
        {Object.keys(data).map((key) => {
          const val = data[key];
          if (!val) return null;
          return <li key={key}>{val}</li>;
        })}
      </ul>
    </article>
  );
};

export default InfoItem;
