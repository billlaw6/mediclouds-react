import { useState } from "react";
import { useDispatch } from "react-redux";
import { PlayerStatusActionE } from "_reducers/playerStatus";

let tempMouseNum = 0;

export default () => {
  const dispatch = useDispatch();
  const { UPDATE_MOUSE_NUM } = PlayerStatusActionE;
  const [target, setTarget] = useState<HTMLElement>();

  const updateMouseNum = (num?: number): void => {
    if (num === tempMouseNum) return;
    tempMouseNum = num || 0;

    dispatch({ type: UPDATE_MOUSE_NUM, payload: num });
  };

  const _onMouseDown = (e: MouseEvent): void => {
    updateMouseNum(e.buttons);
  };
  const _onMouseUp = (): void => {
    updateMouseNum(0);
  };

  const generateMouse = (target: HTMLElement): void => {
    setTarget(target);
    target.addEventListener("mousedown", _onMouseDown);
    target.addEventListener("mouseup", _onMouseUp);
  };

  const destoryMouse = (): void => {
    if (!target) return;
    target.removeEventListener("mousedown", _onMouseDown);
    target.removeEventListener("mouseup", _onMouseUp);
  };

  return { generateMouse, destoryMouse, updateMouseNum };
};
