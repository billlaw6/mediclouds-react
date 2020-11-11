import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import dicomParser from "dicom-parser";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import { PatientExamI } from "_types/api";
import { Button, Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import SeriesView from "./components/SeriesView";
import { PatientI, PlayerDataI, PlayerDataMapT, QueryDataI } from "./type";
import Viewport from "./components/Viewport";
import { useUrlQuery } from "./hooks";
import initialization from "./methods/initialization";

import "./style.less";
import cacheDicoms from "./methods/cacheDicoms";

const IS_MOBILE = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

/** 全局计数 */
let count = 0, // 当前缓存个数
  total = 1; // 总数

let playTimer = 0;

const Player: FunctionComponent = (props) => {
  /** 获取url中的query */
  const { exam: id, series: originSeriesId, frame: originImgIndex } = useUrlQuery<QueryDataI>();

  /* series */
  const [patientInfo, setPatientInfo] = useState<PatientExamI>(); // 病人信息
  const [data, setData] = useState<PlayerDataMapT>(); // 播放器的数据Map
  const [seriesIndex, setSeriesIndex] = useState(0); // 当前series的索引
  const [onCaching, setOnCaching] = useState(true); // 是否在缓存
  const [cacheCount, setCacheCount] = useState(0); // 正在缓存的个数
  const [isPlaying, setIsPlayer] = useState(false); // 是否正在播放

  // /* 缓存dicom数据 */
  // const cacheDicoms = async (dicoms: string[]): Promise<any> => {
  //   count = 0;
  //   setCacheCount(count);
  //   total = dicoms.length;
  //   setOnCaching(true);

  //   const processes: Promise<any>[] = [];

  //   dicoms.forEach((url) => {
  //     processes.push(cornerstone.loadImage(`wadouri:${url}`));
  //   });

  //   console.log("PROCESS LEN", processes.length);

  //   return await Promise.all(processes);
  // };

  // const cacheSeriesDataByIndex = (index: number) => {};

  /* 更新指定索引的Data */
  const updateDataByIndex = useCallback(
    (index: number, nextData: PlayerDataI): void => {
      const _data = data ? new Map(data) : new Map();
      _data.set(index, nextData);
      setData(_data);
    },
    [data],
  );

  /* 获取当前PlayerData */
  const getCurrentData = useCallback(() => {
    if (!data) return undefined;
    return data.get(seriesIndex);
  }, [data, seriesIndex]);

  /* 获取当前或已选择的Data的缓存 */
  const getCurrentCache = (current?: PlayerDataI) => {
    const currentData = current || getCurrentData();
    if (!currentData) return;
    return currentData.cache;
  };

  /* 绘制当前的图像 */
  // const draw = (current?: PlayerDataI): void => {
  //   if (!$viewer.current) return;
  //   const currentData = current || getCurrentData();
  //   if (!currentData) return;
  //   const { cache, frame } = currentData;
  //   if (!cache) return;

  //   const currentImg = cache[frame];
  //   cornerstone.displayImage($viewer.current, currentImg);
  // };

  /* 第一个图像 */
  const first = (): void => {
    const currentData = getCurrentData();
    if (!currentData || !currentData.cache) return;

    updateDataByIndex(seriesIndex, Object.assign({}, currentData, { frame: 0 }));
  };
  /* 最后一个图像 */
  const last = (): void => {
    const currentData = getCurrentData();
    if (!currentData || !currentData.cache) return;

    updateDataByIndex(
      seriesIndex,
      Object.assign({}, currentData, { frame: currentData.cache.length - 1 }),
    );
  };

  /* 第一个序列 */
  const firstSeries = (): void => setSeriesIndex(0);
  /* 最后一个序列 */
  const lastSeries = (): void => data && setSeriesIndex(data.size - 1);

  const pause = (): void => {
    if (playTimer) window.clearInterval(playTimer);
    setIsPlayer(false);
  };

  /* 下一个图像 */
  const next = useCallback((): void => {
    const currentData = getCurrentData();
    console.log("next: currentData", currentData);
    if (!currentData) return;
    const { cache, frame } = currentData;
    console.log("next: cache", cache);

    if (!cache) return;

    const maxIndex = cache.length - 1;

    if (frame + 1 > maxIndex) pause();
    else {
      updateDataByIndex(seriesIndex, Object.assign({}, currentData, { frame: frame + 1 }));
    }
  }, [getCurrentData, seriesIndex, updateDataByIndex]);

  /* 上一个图像 */
  const prev = useCallback((): void => {
    const currentData = getCurrentData();
    if (!currentData) return;
    const { cache, frame } = currentData;
    if (!cache) return;

    updateDataByIndex(
      seriesIndex,
      Object.assign({}, currentData, { frame: Math.max(0, frame - 1) }),
    );
  }, [getCurrentData, seriesIndex, updateDataByIndex]);

  /* 下一个Series */
  const nextSeries = (): void => {
    if (!data) return;
    const maxIndex = data.size - 1;
    setSeriesIndex(Math.min(maxIndex, seriesIndex + 1));
  };

  /* 上一个Series */
  const prevSeries = (): void => {
    if (!data) return;
    setSeriesIndex(Math.max(0, seriesIndex - 1));
  };

  const play = (): void => {
    playTimer = window.setInterval((): void => next(), 500);
    setIsPlayer(true);
  };

  useEffect(() => {
    initialization({
      cs: cornerstone,
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
          {/* <div className="player-viewer" ref={$viewer}></div> */}
          <Viewport cs={cornerstone} data={getCurrentData()}></Viewport>
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
