import { useSelector } from "react-redux";
import { StoreStateI } from "_types/core";

export default () => {
  const settings = useSelector<StoreStateI, StoreStateI["playerSettings"]>(
    (state) => state.playerSettings,
  );

  return { ...settings };
};
