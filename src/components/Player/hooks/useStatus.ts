import { useDispatch, useSelector } from "react-redux";
import { PlayerStatusActionE } from "../../../reducers/playerStatus";
import { StoreStateI } from "_types/core";
import { CstToolNameT } from "../types/common";

export default () => {
  const status = useSelector<StoreStateI, StoreStateI["playerStatus"]>(
    (state) => state.playerStatus,
  );

  const dispatch = useDispatch();
  const {
    SHOW_LEFT_PAN,
    HIDDEN_LEFT_PAN,
    SHOW_RIGHT_PAN,
    HIDDEN_RIGHT_PAN,
    UPDATE_CURRENT_TOOL,
    SWITCH_EXAM_INFO,
  } = PlayerStatusActionE;

  const switchPan = (position: "left" | "right", show: boolean): void => {
    if (position === "left") dispatch({ type: show ? SHOW_LEFT_PAN : HIDDEN_LEFT_PAN });
    if (position === "right") dispatch({ type: show ? SHOW_RIGHT_PAN : HIDDEN_RIGHT_PAN });
  };

  const switchTool = (name: CstToolNameT) => dispatch({ type: UPDATE_CURRENT_TOOL, payload: name });
  const switchExamInfo = (val: boolean) => dispatch({ type: SWITCH_EXAM_INFO, payload: val });

  const clearPlayerStatus = (): void => {
    dispatch({ type: PlayerStatusActionE.CLEAR });
  };

  return {
    ...status,
    switchPan,
    switchTool,
    switchExamInfo,
    clearPlayerStatus,
  };
};
