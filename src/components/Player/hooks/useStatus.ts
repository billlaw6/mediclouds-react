import { useDispatch, useSelector } from "react-redux";
import { PlayerStatusActionE } from "../../../reducers/playerStatus";
import { StoreStateI } from "_types/core";

export default () => {
  const status = useSelector<StoreStateI, StoreStateI["playerStatus"]>(
    (state) => state.playerStatus,
  );
  const dispatch = useDispatch();

  const enableViewport = () => {
    dispatch({ type: PlayerStatusActionE.ENABLE_VIEWPORT });
  };

  return {
    ...status,
    enableViewport,
  };
};
