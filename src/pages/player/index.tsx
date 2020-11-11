import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import dicomParser from "dicom-parser";
import cornerstone from "cornerstone-core";
import cornerstoneTools from "cornerstone-tools";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";

import { Button, Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import SeriesView from "./components/SeriesView";
import { PlayerDataI, QueryDataI } from "./type";
import Viewport from "./components/Viewport";
import { useData, usePlayController, useUrlQuery } from "./hooks";

/** Methods */
import initialization from "./methods/initialization";
import cacheDicoms from "./methods/cacheDicoms";

/** Style */
import "./style.less";

const IS_MOBILE = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

/** 全局计数 */
let count = 0, // 当前缓存个数
  total = 1; // 总数

const Player: FunctionComponent = (props) => {
  /** 获取url中的query */
  const { exam: id, series: originSeriesId, frame: originImgIndex } = useUrlQuery<QueryDataI>();

  /* series */
  const dataRes = useData();
  const { data, setData, setPatientInfo, seriesIndex, getCurrentData, updateDataByIndex } = dataRes;
  const {
    prev,
    next,
    first,
    last,
    firstSeries,
    lastSeries,
    prevSeries,
    nextSeries,
  } = usePlayController(dataRes);

  const [onCaching, setOnCaching] = useState(true); // 是否在缓存
  const [cacheCount, setCacheCount] = useState(0); // 正在缓存的个数
  const [isPlaying, setIsPlayer] = useState(false); // 是否正在播放

  const [cstArr, setCstArr] = useState<any[]>([]); // 需要启用的 cornerstone tool 的工具数组

  useEffect(() => {
    initialization({
      cs: cornerstone,
      cst: cornerstoneTools,
      imgLoader: cornerstoneWADOImageLoader,
      dicomParser,
      examId: id,
      defaultFrame: originImgIndex,
      defaultSeriesId: originSeriesId,
      onProgress: () => {
        count++;
        setCacheCount(count);
      },
      onBeforeCache: (val) => {
        total = val;
        setOnCaching(true);
      },
      onInitCornerstoneTools: () => {
        const LengthTool = cornerstoneTools.LengthTool;
        setCstArr([...cstArr, LengthTool]);
      },
    })
      .then((res) => {
        if (res) {
          const { data, patientInfo } = res;

          setPatientInfo(patientInfo);
          setData(data);
          setOnCaching(false);
          count = 0;
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    console.log("data", data);
    if (!data) return;
    const currentData = getCurrentData();
    if (!currentData) return;
    const { cache, dicoms } = currentData;
    if (!dicoms.length) return;

    if (!cache) {
      cacheDicoms(cornerstone, dicoms, (val) => {
        count = 0;
        total = val;
        setCacheCount(count);
        setOnCaching(true);
      }).then((res) => {
        setOnCaching(false);
        updateDataByIndex(seriesIndex, Object.assign({}, currentData, { cache: res }));
      });
    }
  }, [seriesIndex, data]);

  return (
    <div id="player" className="player">
      {id ? (
        <>
          <Spin
            wrapperClassName="player-spin"
            spinning={onCaching}
            indicator={<LoadingOutlined />}
            tip={`正在加载${Math.round((cacheCount / total) * 100)}%`}
          ></Spin>
          {/* <div className="player-viewer" ref={$viewer}></div> */}
          <Viewport
            cs={cornerstone}
            cst={cornerstoneTools}
            cstArr={cstArr}
            data={getCurrentData()}
          ></Viewport>
          <Space>
            {/* <Button onClick={(): void => (isPlaying ? pause() : play())}>
              {isPlaying ? "暂停" : "播放"}
            </Button> */}
            <Button onClick={firstSeries}>第一个序列</Button>
            <Button onClick={lastSeries}>最后一个序列</Button>

            <Button onClick={nextSeries}>下一个序列</Button>
            <Button onClick={prevSeries}>上一个序列</Button>

            <Button onClick={first}>第一个</Button>
            <Button onClick={last}>最后一个</Button>

            <Button onClick={next}>下一个</Button>
            <Button onClick={prev}>上一个</Button>
          </Space>
          <SeriesView data={data} current={seriesIndex}></SeriesView>
        </>
      ) : (
        <div className="err">找不到检查ID 请从资源列表选择检查</div>
      )}
    </div>
  );
};

export default Player;
