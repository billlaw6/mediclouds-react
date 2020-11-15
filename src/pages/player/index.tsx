import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Button, Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import SeriesView from "./components/SeriesView";
import { PlayerDataI, QueryDataI, ViewportElsI } from "./type";
import Viewport from "./components/Viewport";
import { useCornerstone, useData, usePlayController, useUrlQuery } from "./hooks";

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

  /* hooks */
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
  const [viewportEls, setViewportEls] = useState<ViewportElsI>({}); // 可用视图的html元素

  const { cornerstone, cornerstoneTools } = useCornerstone({
    onLoadProgress: () => {
      count++;
      setCacheCount(count);
    },
  });

  useEffect(() => {
    initialization({
      cs: cornerstone,
      examId: id,
      defaultFrame: originImgIndex,
      defaultSeriesId: originSeriesId,
      onBeforeCache: (val) => {
        total = val;
        setOnCaching(true);
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
          <Viewport
            cs={cornerstone}
            cst={cornerstoneTools}
            data={getCurrentData()}
            onLoad={($el): void => {
              setViewportEls(
                Object.assign({}, viewportEls, {
                  $main: $el,
                }),
              );
            }}
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

            <Button
              onClick={(): void => {
                if (!cornerstone) return;
                const { $main } = viewportEls;
                if (!$main) return;

                const mainEl = cornerstone.getEnabledElement($main);

                console.log("mainEl.viewport, ", mainEl);
                const { viewport, image } = mainEl;

                viewport.voi = {
                  windowWidth: image.windowWidth,
                  windowCenter: image.windowCenter,
                };

                cornerstone.setViewport(mainEl.element, viewport);

                /* 
                viewport.translation.x = 0;
                viewport.translation.y = 0;

                */
              }}
            >
              复原
            </Button>
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
