import React, { FunctionComponent } from "react";
import { LungNoduleI } from "mc-api";
import { useHistory } from "react-router";

import Nodule from "../Nodule";
import "./style.less";

interface VariableCardPropsI {
  data: LungNoduleI[];
  examId: string;
  seriesId: string;
}

const VariableCard: FunctionComponent<VariableCardPropsI> = (props) => {
  const history = useHistory();
  const { data = [], examId, seriesId } = props;

  const goPlayer = (imgIndex: number): void => {
    history.push(`/player/?exam=${examId}&series=${seriesId}&frame=${imgIndex}&lungnodule=1`);
  };

  return (
    <div className="variable-card-content">
      {data.length ? (
        data.map((nodule, noduleIndex) => {
          return (
            <Nodule
              data={nodule}
              index={noduleIndex + 1}
              key={nodule.id}
              onClick={goPlayer}
            ></Nodule>
          );
        })
      ) : (
        <span className="variable-card-empty">没有此类结节</span>
      )}
    </div>
  );
};

export default VariableCard;
