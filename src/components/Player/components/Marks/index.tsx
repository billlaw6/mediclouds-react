import { Button, Input } from "antd";
import React, { FunctionComponent } from "react";
import useMarks from "_components/Player/hooks/useMarks";
import useWindows from "_components/Player/hooks/useWindows";

import "./style.less";

const Marks: FunctionComponent = (props) => {
  const { getFocusWindow } = useWindows();
  const { Length = [], delMark, selectedMark, updateMark } = useMarks();

  const getMarks = () => {
    const currentWin = getFocusWindow();
    if (!currentWin) return null;
    const { element, data: playerSeries } = currentWin;
    if (!element || !playerSeries) return null;
    const { examKey } = playerSeries;
    const renderList = Length.filter((item) => item.examKey === examKey);

    return renderList.map((item, index) => {
      const { desc, data, examKey, seriesKey, frame } = item;
      const { length, unit, active } = data;

      return (
        <li
          className={`player-marks-item${active ? " active" : ""}`}
          key={`marks-${index}`}
          onClick={(): void => {
            selectedMark("Length", item);
          }}
        >
          <div className="player-marks-item-content">
            <span className="player-marks-item-index">{index}.</span>
            <div className="player-marks-item-content-value">
              <span>{`${Math.round(length * 100) / 100}${unit}`}</span>
              <Input
                bordered={false}
                value={desc}
                placeholder="请输入备注"
                onInput={(e): void => {
                  e.stopPropagation();

                  updateMark(
                    "Length",
                    Object.assign({}, item, {
                      desc: e.currentTarget.value,
                    }),
                  );
                }}
              ></Input>
            </div>
            <Button
              size="small"
              key={`marks_del_btn_${index}`}
              danger
              onClick={(): void => {
                delMark("Length", item.data);
              }}
            >
              删除
            </Button>
          </div>
          <div className="player-marks-item-info">
            {`检查: ${examKey} 序列: ${seriesKey} 帧: ${frame}`}
          </div>
        </li>
      );
    });
  };

  return (
    <section className="player-marks">
      <ul className="player-marks-list">{getMarks()}</ul>
    </section>
  );
};

export default Marks;
