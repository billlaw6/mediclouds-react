import { useDispatch, useSelector } from "react-redux";
import { PlayerActionE } from "_reducers/playerSettings";
import { StoreStateI } from "_types/core";

export default () => {
  const settings = useSelector<StoreStateI, StoreStateI["playerSettings"]>(
    (state) => state.playerSettings,
  );
  const dispatch = useDispatch();

  const switchPlayerVersion = (isNewVersion: boolean): void => {
    dispatch({ type: PlayerActionE.SWTICH_PLAYER_VERSION, payload: isNewVersion });
  };

  return { ...settings, switchPlayerVersion };
};
