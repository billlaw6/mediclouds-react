import { useDispatch, useSelector } from "react-redux";
import { PlayerStatusActionE } from "../../../reducers/playerStatus";
import { StoreStateI } from "_types/core";

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
    ENABLE_MOVING_MODE,
    DISABLE_MOVING_MODE,
    ENABLE_SCALE_MODE,
    DISABLE_SCALE_MODE,
    ENABLE_WWWC_MODE,
    DISABLE_WWWC_MODE,
    CLEAR_MODE,
  } = PlayerStatusActionE;

  const switchPan = (position: "left" | "right", show: boolean): void => {
    if (position === "left") dispatch({ type: show ? SHOW_LEFT_PAN : HIDDEN_LEFT_PAN });
    if (position === "right") dispatch({ type: show ? SHOW_RIGHT_PAN : HIDDEN_RIGHT_PAN });
  };

  const clearMode = (): void => {
    dispatch({ type: CLEAR_MODE });
  };
  const switchMovingMode = (val: boolean) =>
    val ? dispatch({ type: ENABLE_MOVING_MODE }) : dispatch({ type: DISABLE_MOVING_MODE });
  const switchScaleMode = (val: boolean) =>
    val ? dispatch({ type: ENABLE_SCALE_MODE }) : dispatch({ type: DISABLE_SCALE_MODE });
  const switchWwwcMode = (val: boolean) =>
    val ? dispatch({ type: ENABLE_WWWC_MODE }) : dispatch({ type: DISABLE_WWWC_MODE });

  return {
    ...status,
    switchPan,
    switchMovingMode,
    switchScaleMode,
    switchWwwcMode,
    clearMode,
  };
};
