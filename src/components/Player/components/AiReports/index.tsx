import { Button, Select, Space, message } from "antd";
import React, { FunctionComponent, useEffect, useState } from "react";
import { getLungNoduleReport } from "_api/ai";
import useData from "_components/Player/hooks/useData";
import useWindows from "_components/Player/hooks/useWindows";
import Scrollbar from "react-custom-scrollbars";
import { getTexVal, getMaxDimIdx } from "_helper";

import "./style.less";

const { Option } = Select;

const AiReports: FunctionComponent = () => {
  const {
    examList,
    lungNoduleReport,
    updateLungNodulesReport,
    getPlayerSeriesById,
    playerExamMap,
  } = useData();
  const { getFocusWindow, updateWin } = useWindows();
  const [aiList, setAiList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAi, setSelectedAi] = useState<string>("lungNodule");

  const currentWindow = getFocusWindow();

  const getCurrentOriginExam = () => {
    if (!examList || !currentWindow) return;
    const { data: playerSeries } = currentWindow;
    if (!playerSeries) return;

    const { examKey } = playerSeries;
    return examList[examKey];
  };

  const getContent = () => {
    if (!lungNoduleReport) return null;
    const { desc, nodule_details = [], err, series_id } = lungNoduleReport;
    if (err) return <div className="player-ai-reports-content">{desc}</div>;
    return (
      <div className="player-ai-reports-content">
        <Scrollbar autoHide>
          {nodule_details.map((nodule) => {
            const {
              id,
              image_details,
              disp_z,
              vol,
              long_axis,
              short_axis,
              solid_axis,
              solid_ratio,
              cal_ratio,
              gg_ratio,
              max_hu,
              min_hu,
              mean_hu,
              tex,
              description,
              max_dim_idx,
            } = nodule;

            return (
              <div
                className={`player-ai-reports-item${
                  currentWindow && currentWindow.frame === disp_z ? " active" : ""
                }`}
                key={id}
                onClick={(): void => {
                  if (!currentWindow || !playerExamMap) return;
                  const { data: playerSeries } = currentWindow;
                  if (!playerSeries || !playerSeries.cache) return;
                  if (playerSeries.id !== series_id) {
                    const { examKey } = playerSeries;
                    const currentExam = playerExamMap.get(examKey);
                    if (!currentExam) return;
                    const nextSeries = getPlayerSeriesById(currentExam, series_id);
                    if (!currentExam) return;

                    updateWin(currentWindow.key, { frame: disp_z, data: nextSeries });
                  } else {
                    updateWin(currentWindow.key, { frame: disp_z });
                  }
                }}
              >
                <div className="player-ai-reports-item-imgs">
                  <Space direction="vertical" align="center">
                    <span>横断面（z）</span>
                    <img src={image_details.z_image_tag}></img>
                  </Space>
                  <Space direction="vertical" align="center">
                    <span>矢状面（x）</span>
                    <img src={image_details.x_image_tag}></img>
                  </Space>
                  <Space direction="vertical" align="center">
                    <span>冠状面（y）</span>
                    <img src={image_details.y_image_tag}></img>
                  </Space>
                </div>
                <div className="player-ai-reports-item-content">
                  <Space direction="vertical" size="small">
                    <span>位置(帧): {disp_z + 1}</span>
                    <span>
                      体积(mm<sup>3</sup>): {vol}
                    </span>
                    <span>结节材质: {getTexVal(tex)}</span>
                    <span>
                      尺寸(mm x mm): {`${long_axis} x ${short_axis}(${getMaxDimIdx(max_dim_idx)})`}
                    </span>
                    <span>
                      实性部分长轴(mm): {solid_axis ? Math.round(solid_axis * 100) / 100 : "-"}
                    </span>
                    <span>实性部分比例(%): {Math.round(solid_ratio * 100)}</span>
                    <span>钙化比例(%): {Math.round(cal_ratio * 100)}</span>
                    <span>磨玻璃比例(%): {Math.round(gg_ratio * 100)}</span>
                    <span>最大CT值: {max_hu}</span>
                    <span>最小CT值: {min_hu}</span>
                    <span>平均CT值: {mean_hu}</span>
                    <span>结节位置: {description}</span>
                  </Space>
                </div>
              </div>
            );
          })}
        </Scrollbar>
      </div>
    );
  };

  useEffect(() => {
    const currentOriginExam = getCurrentOriginExam();
    if (!currentOriginExam) return;
    const { lung_nodule_flag } = currentOriginExam;
    const _aiList: string[] = [];

    if (lung_nodule_flag === 1) _aiList.push("lungNodule");

    setAiList(_aiList);
  }, [examList, currentWindow]);

  return (
    <section className="player-ai-reports">
      {aiList.length ? (
        <Space className="player-ai-reports-selector" direction="horizontal">
          <Select
            onChange={(value) => setSelectedAi(value.toString())}
            value={selectedAi}
            placeholder="请选择AI报告类型"
          >
            {aiList.map((item) => {
              return (
                <Option value={item} key={item}>
                  肺结节AI筛查
                </Option>
              );
            })}
          </Select>
          <Button
            type="primary"
            loading={loading}
            onClick={(): void => {
              const currentOriginExam = getCurrentOriginExam();
              if (!currentOriginExam) return;
              if (selectedAi === "lungNodule") {
                setLoading(true);
                getLungNoduleReport(currentOriginExam.id)
                  .then((res) => {
                    updateLungNodulesReport(res);
                  })
                  .catch((err) => {
                    if (err === 400) {
                      message.warning({
                        content: "此检查还未做过肺结节AI筛查报告",
                      });
                    }
                  })
                  .finally(() => setLoading(false));
              }
            }}
          >
            查询
          </Button>
        </Space>
      ) : (
        <span>此检查没有可使用的AI功能</span>
      )}
      {getContent()}
    </section>
  );
};
export default AiReports;
