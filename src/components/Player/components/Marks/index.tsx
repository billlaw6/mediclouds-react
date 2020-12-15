import { Button, List, Input } from "antd";
import React, { FunctionComponent } from "react";
import useMarks from "_components/Player/hooks/useMarks";
import useWindows from "_components/Player/hooks/useWindows";

import "./style.less";

const { Item: ListItem } = List;

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
      const { desc, data } = item;
      const { length, unit, active } = data;

      return (
        <ListItem
          className={`player-marks-item${active ? " active" : ""}`}
          key={`marks-${index}`}
          onClick={(): void => {
            selectedMark("Length", item);
          }}
          actions={[
            <Button
              size="small"
              key={`marks_del_btn_${index}`}
              danger
              onClick={(): void => {
                delMark("Length", item.data);
              }}
            >
              删除
            </Button>,
          ]}
        >
          <ListItem.Meta
            avatar={<div>{index}</div>}
            title={
              <Input
                bordered={false}
                value={desc}
                placeholder="请输入备注"
                onInput={(e): void => {
                  updateMark(
                    "Length",
                    Object.assign({}, item, {
                      desc: e.currentTarget.value,
                    }),
                  );
                }}
              ></Input>
            }
            description={`${Math.round(length * 100) / 100}${unit}`}
          ></ListItem.Meta>
        </ListItem>
      );
    });
  };

  return (
    <section className="player-marks">
      <List itemLayout="horizontal">{getMarks()}</List>
    </section>
  );
};

export default Marks;
