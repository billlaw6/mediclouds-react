import { useDispatch } from "react-redux";
import { PlayerStatusActionE } from "_reducers/playerStatus";
import useData from "./useData";

let tempKeyName = "";

export default () => {
  const dispatch = useDispatch();
  const { UPDATE_KEYNAME } = PlayerStatusActionE;

  const updateKeyName = (name?: string): void => {
    if (name === tempKeyName) return;
    tempKeyName = name || "";
    dispatch({ type: UPDATE_KEYNAME, payload: name });
  };

  const onKeydown = (e: KeyboardEvent): void => {
    updateKeyName(e.code);
  };
  const onKeyup = (): void => {
    updateKeyName("");
  };

  const generateKeyboard = (): void => {
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);
  };

  const destoryKeyboard = (): void => {
    document.removeEventListener("keypress", onKeydown);
    document.removeEventListener("keyup", onKeyup);
  };

  return {
    generateKeyboard,
    destoryKeyboard,
  };
};
