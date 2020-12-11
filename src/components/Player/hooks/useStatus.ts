import { useDispatch, useSelector } from "react-redux";
import { PlayerStatusActionE } from "../../../reducers/playerStatus";
import { StoreStateI } from "_types/core";

export default () => {
  const status = useSelector<StoreStateI, StoreStateI["playerStatus"]>(
    (state) => state.playerStatus,
  );

  const dispatch = useDispatch();
  const { SHOW_LEFT_PAN, HIDDEN_LEFT_PAN, SHOW_RIGHT_PAN, HIDDEN_RIGHT_PAN } = PlayerStatusActionE;

  const switchPan = (position: "left" | "right", show: boolean): void => {
    if (position === "left") dispatch({ type: show ? SHOW_LEFT_PAN : HIDDEN_LEFT_PAN });
    if (position === "right") dispatch({ type: show ? SHOW_RIGHT_PAN : HIDDEN_RIGHT_PAN });
  };

  return {
    ...status,
    switchPan,
  };
};
