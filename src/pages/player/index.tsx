import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import dicomParser from "dicom-parser";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import { getDicomSeries } from "_api/dicom";
import { useHistory, useLocation } from "react-router-dom";
import { PatientExamI, SeriesI, SeriesListI } from "_types/api";
import { Button, Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import "./style.less";

const IS_MOBILE = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

let count = 0,
  total = 1;

interface PlayerDataI extends SeriesI {
  cache?: any[]; // 当前序列的缓存
  frame: number; // 当前series在第几帧（图片索引）
}

const Player: FunctionComponent = (props) => {
  const localton = useLocation<{ id: string }>();
  const { id = "" } = localton.state;
  const $viewer = useRef<HTMLDivElement>(null);

  /* series */
  const [patientInfo, setPatientInfo] = useState<PatientExamI>(); // 病人信息
  const [data, setData] = useState<Map<number, PlayerDataI>>(); // 播放器的数据Map
  const [seriesIndex, setSeriesIndex] = useState(0); // 当前series的索引
  const [onCaching, setOnCaching] = useState(true); // 是否在缓存
  const [cacheCount, setCacheCount] = useState(0); // 正在缓存的个数

  /* 缓存dicom数据 */
  const cacheDicoms = async (dicoms: string[]) => {
    count = 0;
    setCacheCount(count);
    total = dicoms.length;
    setOnCaching(true);

    const processes: Promise<any>[] = [];

    dicoms.forEach((url) => {
      processes.push(cornerstone.loadImage(`wadouri:${url}`));
    });

    console.log("PROCESS LEN", processes.length);

    return await Promise.all(processes);
  };

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
    console.log("getCurrentData", data);
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
  const draw = (current?: PlayerDataI): void => {
    if (!$viewer.current) return;
    const currentData = current || getCurrentData();
    if (!currentData) return;
    const { cache, frame } = currentData;
    if (!cache) return;

    const currentImg = cache[frame];
    cornerstone.displayImage($viewer.current, currentImg);
  };

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

  /* 下一个图像 */
  const next = useCallback((): void => {
    const currentData = getCurrentData();
    console.log("next: currentData", currentData);
    if (!currentData) return;
    const { cache, frame } = currentData;
    console.log("next: cache", cache);

    if (!cache) return;

    const maxIndex = cache.length - 1;
    updateDataByIndex(
      seriesIndex,
      Object.assign({}, currentData, { frame: Math.min(maxIndex, frame + 1) }),
    );
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

  const wheelChange = useCallback(
    (event: WheelEvent): void => {
      const { deltaY } = event;
      console.log("deltaY", deltaY);

      // if (isPlay) pause();
      if (deltaY > 0) next();
      if (deltaY < 0) prev();

      event.preventDefault();
    },
    [next, prev],
  );

  useEffect(() => {
    if (!id) return;

    // 初始化cs相关
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.configure({
      useWebWorkers: false,
      onloadend: () => {
        count += 1;
        setCacheCount(count);
      },
    });

    cornerstone.enable($viewer.current);

    getDicomSeries(id)
      .then((res) => {
        console.log("res", res);
        const { children, ...others } = res;

        // 更新病人信息
        setPatientInfo(others);

        // 初始化不含缓存的PlayerData Map
        const _data = new Map<number, PlayerDataI>();
        children.forEach((item, index) => {
          _data.set(
            index,
            Object.assign({}, item, {
              frame: 0,
            }),
          );
        });

        setData(_data);
      })
      .catch((err) => console.error(err));

    if (IS_MOBILE) {
      // 移动端事件绑定
    } else {
      // web端事件绑定
      if ($viewer.current) {
        $viewer.current.addEventListener("wheel", wheelChange, { passive: false });

        return (): void => {
          $viewer.current && $viewer.current.removeEventListener("wheel", wheelChange);
        };
      }
    }
  }, [id]);

  useEffect(() => {
    if (!data) return;
    const currentData = getCurrentData();
    if (!currentData) return;
    const { cache, dicoms } = currentData;
    if (!dicoms.length) return;

    if (!cache) {
      cacheDicoms(dicoms)
        .then((res) => {
          setOnCaching(false);
          updateDataByIndex(seriesIndex, Object.assign({}, currentData, { cache: res }));
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      draw(currentData);
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
          <div className="player-viewer" ref={$viewer}></div>
          <Space>
            <Button onClick={firstSeries}>第一个序列</Button>
            <Button onClick={lastSeries}>最后一个序列</Button>

            <Button onClick={nextSeries}>下一个序列</Button>
            <Button onClick={prevSeries}>上一个序列</Button>

            <Button onClick={first}>第一个</Button>
            <Button onClick={last}>最后一个</Button>

            <Button onClick={next}>下一个</Button>
            <Button onClick={prev}>上一个</Button>
          </Space>
        </>
      ) : (
        <div className="err">找不到检查ID 请从资源列表选择检查</div>
      )}
    </div>
  );
};

export default Player;
