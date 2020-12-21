import React, { FunctionComponent, useEffect } from "react";

import Tools from "./components/Tools";
import Viewport from "./components/Viewport";
import Header from "./components/Header";

import useData from "./hooks/useData";
import useWindows from "./hooks/useWindows";
import useKeyboard from "./hooks/useKeyboard";

import { PlayerPropsI } from "./types/common";

import "./style.less";
import useStatus from "./hooks/useStatus";
import useMarks from "./hooks/useMarks";

const Player: FunctionComponent<PlayerPropsI> = (props) => {
  const { exams, backTo } = props;

  const { initPlayerExamMap, initLungNoduleMap, clearPlayerData } = useData();
  const { initWindows, windowsMap, getFocusWindow, clearPlayerWindows } = useWindows();
  const { clearPlayerStatus } = useStatus();
  const { clearPlayerMarks } = useMarks();
  // const { generateKeyboard, destoryKeyboard } = useKeyboard();

  useEffect(() => {
    initPlayerExamMap(exams)
      .then((res) => {
        initWindows(exams, res);
        return initLungNoduleMap(exams);
      })
      .then(() => {
        console.log("INIT SUCCESSED");
      })
      .catch((err) => {
        console.error("INIT FAILD", err);
      });

    document.oncontextmenu = () => false;

    return () => {
      clearPlayerData();
      clearPlayerWindows();
      clearPlayerStatus();
      clearPlayerMarks();
    };
  }, []);

  return (
    <div id="player">
      {/* <Header backTo={backTo}></Header> */}
      <Tools></Tools>
      <div className="player-content">
        <Viewport></Viewport>
      </div>
    </div>
  );
};

export default Player;
