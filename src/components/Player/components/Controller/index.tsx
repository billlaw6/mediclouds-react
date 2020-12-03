import { Button } from "antd";
import React, { FunctionComponent } from "react";
import useStatus from "_components/Player/hooks/useStatus";

import "./style.less";

const Controller: FunctionComponent = () => {
  const { isPlay, play, pause, prev, next } = useStatus();

  return (
    <div id="controller">
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
