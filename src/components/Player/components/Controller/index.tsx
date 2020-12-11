import { Button } from "antd";
import React, { FunctionComponent } from "react";
import useStatus from "_components/Player/hooks/useStatus";
import useWindows from "_components/Player/hooks/useWindows";
import { WindowI } from "_components/Player/types/window";

import "./style.less";

const Controller: FunctionComponent = () => {
  const { play, pause, prev, next, getFocusWindow } = useWindows();
  const focusWin = getFocusWindow() || ({} as WindowI);

  const { isPlay, data, element } = focusWin;
  const disabled = !data || !element;

  return (
    <div id={`controller${disabled ? " disabled" : ""}`}>
      <Button onClick={(): void => (isPlay ? pause() : play())}>{isPlay ? "暂停" : "播放"}</Button>
      <Button
        onClick={(): void => {
          if (isPlay) pause();
          next();
        }}
      >
        下一个
      </Button>
      <Button
        onClick={(): void => {
          if (isPlay) pause();
          prev();
        }}
      >
        上一个
      </Button>
    </div>
  );
};

export default Controller;
