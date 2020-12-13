import { Select } from "antd";
import React, { FunctionComponent, useEffect, useState } from "react";
import useData from "_components/Player/hooks/useData";
import useWindows from "_components/Player/hooks/useWindows";

const { Option } = Select;

const AiReports: FunctionComponent = () => {
  const { examList, playerExamMap } = useData();
  const { getFocusWindow } = useWindows();
  const [aiList, setAiList] = useState<string[]>([]);

  const currentWindow = getFocusWindow();

  useEffect(() => {
    if (!examList || !currentWindow) return;
    const { data: playerSeries } = currentWindow;
    if (!playerSeries) return;

    const { examKey } = playerSeries;
    const currentOriginExam = examList[examKey];
    const { lung_nodule_flag } = currentOriginExam;
    const _aiList: string[] = [];

    if (lung_nodule_flag === 1) _aiList.push("lungNodule");

    setAiList(_aiList);
  }, [examList, currentWindow]);

  return (
    <section className="player-ai-reports">
      {aiList.length ? (
        <Select onChange={(value) => console.log(value)}>
          {aiList.map((item) => {
            return (
              <Option value={item} key={item}>
                肺结节AI筛查
              </Option>
            );
          })}
        </Select>
      ) : (
        <span>此检查没有可使用的AI功能</span>
      )}
    </section>
  );
};
export default AiReports;
