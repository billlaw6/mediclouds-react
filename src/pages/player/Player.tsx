/* 
!=========== 所有列表的index从1开始算，与series保持一致 ============!
!=========== 从Array里写入、读取时记得当前的index - 1 才是array内的index =========!

1. 进入后首先获取seriesList 渲染左边的序列缩略图
2. 然后获取当前序列的信息
3. 对当前序列的image进行缓存，并显示进度条。同时下方控制器不可用的状态
4. 加载完毕后，启用下方控制器，canvas中渲染当前序列的当前图像
5. 切换序列时，重复步骤3-4

！=============  有关全屏Mpr ============== ！
由于有不同分辨率的屏幕（甚至正方形），而影像绝大多数趋于正方形
目前设计稿选中图片战幕整个height的方式使得其他两个没有空间渲染
所以有如下约定：

  1. 将整个屏幕宽度分成三等分，被选中的图片占据左边2份宽度
  2. 剩下的1份再将屏幕高度二等分，剩下两张占据1份宽度，1份高度
  3. 所有图片在各自区域内垂直水平居中
  4. 所有图片完全显示

  -------------
  |       |   |
  |       -----
  |       |   |
  -------------

*/
import React, {
  ReactElement,
  FunctionComponent,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  MouseEvent,
} from "react";
import LinkButton from "_components/LinkButton/LinkButton";
import { Scrollbars } from "react-custom-scrollbars";

import { SeriesImgCacheListT, ImgDrawInfoI, MprImgClientRects, MprImgAndSizeI } from "./type";
import { Slider, Progress, Tag } from "antd";
import { CustomHTMLDivElement } from "_types/core";

import Shortcut from "./components/Shortcut";
import imgLoaderrImg from "_images/img-load-err.jpg";
import {
  ArrowLeftOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PauseOutlined,
  CaretRightOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import useReport from "_hooks/useReport";
import {
  getLungSeries,
  getMprSeries,
  getSeriesList_OLD,
  getSeries,
  LungNoduleI,
  ImageI,
  SeriesListI,
  SeriesI,
  PatientExamI,
} from "mc-api";
import useSettings from "_components/Player/hooks/useSettings";
import useAccount from "_hooks/useAccount";

import PatientInfo from "./components/PatientInfo";
import Fns from "./components/Fns";

import "./Player.less";

const VIEWPORT_WIDTH_DEFAULT = 890; // 视图默认宽
const VIEWPORT_HEIGHT_DEFAULT = 550; // 视图默认高
const MPR_VIEWPORT_WIDTH_DEFAULT = 1152; // mpr 视图默认宽
const MPR_VIEWPORT_HEIGHT_DEFAULT = 420; // mpr 视图默认高

const imgLoadErr = new Image();
imgLoadErr.src = imgLoaderrImg;

/* ====== Helper Methods ====== */

// 获取图片完全显示在视图区域并保持比例的信息：
// x, y：相对于视图区域的x，y轴坐标
// width，height：图片渲染的尺寸
const getDrawInfo = (
  viewWidth: number,
  viewHeight: number,
  width: number,
  height: number,
  scale = 1,
): MprImgClientRects => {
  let drawW = 0,
    drawH = 0,
    x = 0,
    y = 0;

  if (viewWidth / width < viewHeight / height) {
    // 视图和图片宽度比 小于 视图和图片高度比， 宽度等于视图宽度
    drawW = viewWidth;
    drawH = (drawW * height) / width;
    y = (viewHeight - drawH) / 2;
  } else {
    // 视图和图片宽度比 大于 视图和图片高度比， 高度等于视图高度
    drawH = viewHeight;
    drawW = (drawH * width) / height;
    x = (viewWidth - drawW) / 2;
  }

  if (scale !== 1) {
    const _dw = drawW,
      _dh = drawH;

    drawW = _dw * scale;
    drawH = _dh * scale;

    x = x - (drawW - _dw) * 0.5;
    y = y - (drawH - _dh) * 0.5;
  }

  return { x, y, width: drawW, height: drawH };
};

let playTimer: number | undefined = undefined;
let showPanelsTimer: number | undefined = undefined;
const DEFAULT_FNS_STATUS = {
  move: false,
  offset: [0, 0],
  scale: 1,
};
// 监听键盘事件
const LEFT = 37,
  RIGHT = 39,
  UP = 38,
  DOWN = 40,
  PLAY_PAUSE = 32,
  MOVE = 17, // control
  ZOOM_IN = 65, // A
  ZOOM_OUT = 90, // Z
  RESET = 82; // R

let isMoving = false; // 是否在移动
let cacheOffset: number[] = [0, 0]; // 缓存位置信息
let mouseStartPoint: number[] = [0, 0]; // 鼠标起始点位置坐标

interface PlayerPropsI {
  exam: string;
  series: string;
  index: number;
  lungnodule: 0 | 1;
}

const Player: FunctionComponent<PlayerPropsI> = (props) => {
  // let ctx: CanvasRenderingContext2D | null = null;
  const {
    exam: id,
    series: originSeriesId,
    index: originImgIndex,
    lungnodule: showLungNodules,
  } = props;

  const { account } = useAccount();
  const { switchPlayerVersion } = useSettings();
  const { lungNodule } = useReport();
  /* =============== use ref =============== */
  const $player = useRef<CustomHTMLDivElement>(null);
  const $viewport = useRef<HTMLCanvasElement>(null);
  /* =============== use state =============== */
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [isMpr, setIsMpr] = useState(false); // 是否为mpr模式
  const [progress, setProgress] = useState(0); // 加载进度
  const [patient, setPatient] = useState<PatientExamI>({
    patient_name: "NA",
    patient_id: "NA",
    birthday: "NA",
    sex: "",
    study_date: "NA",
    institution_name: "NA",
    modality: "NA",
  });
  const [cacheDone, setCacheDone] = useState(false); // 是否缓存图片完毕
  const [seriesIndex, setSeriesIndex] = useState(1); // 序列索引
  const [imgIndexs, setImgIndexs] = useState([1]); // 序列当前图像索引列表
  const [isPlay, setPlay] = useState(false); // 是否播放
  const [isShowInfo, setShowInfo] = useState(true); // 是否显示病人信息
  const [isFullscreen, setFullscreen] = useState(false); // 是否全屏
  const [isShowPanels, setShowPanels] = useState(false); // 全屏时是否显示信息和控制面板
  const [viewportSize, setViewportSize] = useState([
    VIEWPORT_WIDTH_DEFAULT,
    VIEWPORT_HEIGHT_DEFAULT,
  ]); // 视图区域width&height
  const [seriesList, setSeriesList] = useState<SeriesListI>(); // seriesList信息
  const [seriesMap, setSeriesMap] = useState<Map<string, SeriesI>>(new Map()); // series信息集合
  const [cache, setCache] = useState<SeriesImgCacheListT>([]); // 缓存列表
  const [mprCache, setMprCache] = useState<Map<string, HTMLImageElement[][]>>(new Map()); // mpr缓存列表
  const [mprSeriesIndex, setMprSeriesIndex] = useState(1); // mpr序列索引 取 0｜1｜2
  const [mprImgRange, setMprImgRange] = useState<ImgDrawInfoI[]>([]); // 保存当前mpr每个img在视图区域的范围
  const [mprImgIndexs, setMprImgIndexs] = useState<number[]>([1, 1, 1]); // mpr每个序列当前图片的索引
  const [currentSeries, setCurrentSeries] = useState<SeriesI>(); // 当前的序列
  const [currentNodule, setCurrentNodule] = useState<LungNoduleI>(); // 当前选择的结节
  const [fns, setFns] = useState<{
    [key: string]: any;
    move: boolean;
    offset: number[];
    scale: number;
  }>(DEFAULT_FNS_STATUS);

  const [showShortcut, setShowShortcut] = useState(false); // 是否显示快捷键

  /* =============== methods =============== */

  /**
   * 初始化 拉取数据
   *
   * 1. 拉取seriesList
   * 2. 初始化 当前的序列索引、当前的图片索引
   * 3. 拉取所有的series内容
   * 4. 设置 病人信息、序列索引、图片索引、当前的序列
   */
  const init = async (examId: string) => {
    if (!examId) return;

    let _seriesIndex = 1,
      _imgIndex = 1;

    /* 获取series 列表 */
    try {
      const seriesListRes = await getSeriesList_OLD(examId);
      if (!seriesListRes) return;

      const { children, ...args } = seriesListRes;

      const _imgIndexsArr = new Array<number>(children.length).fill(1);

      if (originSeriesId) {
        _seriesIndex = children.findIndex((item) => item.id === originSeriesId) + 1 || 1;
      }
      if (originImgIndex) {
        _imgIndex = originImgIndex + 1;
        _imgIndexsArr[_seriesIndex - 1] = _imgIndex;
      }

      /* 获取所有series内容 */
      const _seriesMap = new Map<string, SeriesI>();
      const getSeriesArr: Promise<SeriesI>[] = [];

      let _getSeries = getSeries;

      children.forEach((series) => {
        const { id } = series;

        if (showLungNodules === 1 && lungNodule) {
          const { series_id, flag, nodule_details } = lungNodule;

          if (flag > 0 && nodule_details && id === series_id) {
            _getSeries = getLungSeries;
          }
        }

        getSeriesArr.push(_getSeries(id));
      });

      const seriesArrRes = await Promise.all(getSeriesArr);
      seriesArrRes.forEach((item) => {
        const { id } = item;
        _seriesMap.set(id, item);
      });

      let _currentNodule: LungNoduleI | undefined = undefined;

      if (showLungNodules === 1 && lungNodule) {
        const { nodule_details } = lungNodule;
        if (nodule_details) {
          _currentNodule = nodule_details.find(
            (item) => item.disp_z + 1 === _imgIndexsArr[_seriesIndex - 1],
          );
        }
      }

      setPatient(args); // 病人信息
      setSeriesIndex(_seriesIndex); // 序列索引
      setSeriesList(seriesListRes); // 序列列表
      setImgIndexs(_imgIndexsArr); // 图片索引
      setSeriesMap(_seriesMap); // 序列详情信息
      setCurrentSeries(seriesArrRes[_seriesIndex - 1]); // 当前的序列
      if (_currentNodule) setCurrentNodule(_currentNodule);
    } catch (err) {
      throw new Error(err);
    }
  };

  /** 更新功能状态 */
  const updateFnStatus = (key: string, val: any) => {
    setFns(Object.assign({}, fns, { [key]: val }));
  };

  const resetFns = (): void => {
    setFns(DEFAULT_FNS_STATUS);
    cacheOffset = [0, 0];
    mouseStartPoint = [0, 0];
    isMoving = false;
  };

  // 获取当前series信息
  // const getCurrentSerie = useCallback((): SeriesI | undefined => {
  //   if (!seriesList) return undefined;
  //   const { id } = seriesList.children[seriesIndex - 1];
  //   return seriesMap.get(id);
  // }, [seriesIndex, seriesList, seriesMap]);

  /**
   * 更改选中的序列
   * @param {string} id 序列id
   */
  const changeSeries = (id: string): void => {
    if (!seriesList) return;

    const originList = [...seriesList.children];
    let num = 1; // temp
    const selectSeries = originList.find((item, index) => {
      if (item.id === id) {
        num = index + 1;
        return true;
      }
    });

    if (selectSeries) {
      // setSeriesIndex(selectSeries.series_number);
      setSeriesIndex(num);
      if (seriesMap) setCurrentSeries(seriesMap.get(id));
      if (!cache[num - 1]) {
        setCacheDone(false);
        setProgress(0);
      }
    }
  };

  // 暂停
  const pause = useCallback((): void => {
    cacheDone && setPlay(false);
  }, [cacheDone]);

  /**
   * 切换全屏状态
   * @param {boolean} isFullscreen 当前全屏状态
   */
  const changeFullscreen = (isFullscreen: boolean): void => {
    if (!cacheDone) return;
    if (isPlay) pause();
    if ($player && $player.current) {
      if (isFullscreen) {
        const document: any = window.document; // magic
        if (document.exitFullscreen) return document.exitFullscreen();
        if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
      } else {
        if ($player.current.requestFullscreen) {
          $player.current.requestFullscreen();
        } else if ($player.current.webkitRequestFullscreen) {
          $player.current.webkitRequestFullscreen();
        } else if ($player.current.mozRequestFullScreen) {
          $player.current.mozRequestFullScreen();
        } else if ($player.current.msRequestFullscreen) {
          $player.current.msRequestFullscreen();
        }
      }
    }
  };

  // 下一个序列
  const nextSeries = useCallback((): void => {
    if (!seriesList || !seriesMap) return;
    if (isPlay) pause();
    const nextSeriesIndex = Math.min(seriesIndex + 1, seriesList.children.length);
    setSeriesIndex(nextSeriesIndex);
    setCurrentSeries(seriesMap.get(seriesList.children[nextSeriesIndex - 1].id));
    if (!cache[nextSeriesIndex - 1]) {
      setCacheDone(false);
      setProgress(0);
    }
  }, [cache, isPlay, pause, seriesIndex, seriesList, seriesMap]);

  // 上一个序列
  const prevSeries = useCallback((): void => {
    if (!seriesList || !seriesMap) return;
    if (isPlay) pause();
    const nextSeriesIndex = Math.max(seriesIndex - 1, 1);
    setSeriesIndex(nextSeriesIndex);
    setCurrentSeries(seriesMap.get(seriesList.children[nextSeriesIndex - 1].id));
    if (!cache[nextSeriesIndex - 1]) {
      setCacheDone(false);
      setProgress(0);
    }
  }, [cache, isPlay, pause, seriesIndex, seriesList, seriesMap]);

  // 下一张图片
  const next = useCallback((): void => {
    if (!cacheDone) return;
    if (!currentSeries || !currentSeries.pictures) return;

    const next = [...imgIndexs];
    const seriesIndexInArray = seriesIndex - 1;
    const nextNum = Math.min(currentSeries.pictures.length, next[seriesIndexInArray] + 1); // 这里应为当前序列的图像数量 - 1
    next[seriesIndexInArray] = nextNum;

    setImgIndexs(next);
    if (nextNum === currentSeries.pictures.length && isPlay) setPlay(false);
  }, [cacheDone, currentSeries, imgIndexs, isPlay, seriesIndex]);

  // 下一张MPR图片
  const nextMpr = useCallback((): void => {
    if (!currentSeries || !cacheDone) return;
    const currentMprCache = mprCache.get(currentSeries.id);
    if (!currentMprCache) return;

    const next = [...mprImgIndexs];
    const mprSeriesIndexInArray = mprSeriesIndex - 1;
    const nextNum = Math.min(
      currentMprCache[mprSeriesIndex - 1].length,
      next[mprSeriesIndexInArray] + 1,
    );
    next[mprSeriesIndexInArray] = nextNum;
    setMprImgIndexs(next);

    if (nextNum === currentMprCache[mprSeriesIndex - 1].length && isPlay) setPlay(false);
  }, [cacheDone, currentSeries, isPlay, mprCache, mprImgIndexs, mprSeriesIndex]);

  // 上一张图片
  const prev = useCallback((): void => {
    if (!cacheDone) return;
    const next = [...imgIndexs];
    const seriesIndexInArray = seriesIndex - 1;
    const nextNum = Math.max(1, next[seriesIndexInArray] - 1);
    next[seriesIndexInArray] = nextNum;

    setImgIndexs(next);
  }, [cacheDone, imgIndexs, seriesIndex]);

  // 上一张MPR图片
  const prevMpr = useCallback((): void => {
    if (!cacheDone) return;
    const next = [...mprImgIndexs];
    const mprSeriesIndexInArray = mprSeriesIndex - 1;
    const nextNum = Math.max(1, next[mprSeriesIndexInArray] - 1);
    next[mprSeriesIndexInArray] = nextNum;

    setMprImgIndexs(next);
  }, [cacheDone, mprImgIndexs, mprSeriesIndex]);

  // 第一张图片
  const first = useCallback((): void => {
    if (!cacheDone) return;
    const next = [...imgIndexs];
    next[seriesIndex - 1] = 1;

    setImgIndexs(next);
  }, [cacheDone, imgIndexs, seriesIndex]);

  // 第一张MPR图片
  const firstMpr = (): void => {
    if (!cacheDone) return;
    const next = [...mprImgIndexs];
    next[mprSeriesIndex - 1] = 1;

    setMprImgIndexs(next);
  };

  // 最后一张图片
  const last = (): void => {
    if (!cacheDone) return;
    if (!currentSeries || !currentSeries.pictures) return;

    const next = [...imgIndexs];
    next[seriesIndex - 1] = currentSeries.pictures.length; // 这里应为当前序列的图像数量 - 1

    setImgIndexs(next);
  };

  // 最后一张MPR图片
  const lastMpr = (): void => {
    if (!currentSeries || !cacheDone) return;
    const currentMprCache = mprCache.get(currentSeries.id);
    if (!currentMprCache) return;

    const next = [...mprImgIndexs];
    next[mprSeriesIndex - 1] = currentMprCache[mprSeriesIndex - 1].length; // 这里应为当前序列的图像数量 - 1

    setMprImgIndexs(next);
  };

  // 播放
  const play = useCallback((): void => {
    if (cacheDone && currentSeries) {
      const currentImgIndex = imgIndexs[seriesIndex - 1];
      if (currentSeries.pictures.length === currentImgIndex) first();
      setPlay(true);
    }
  }, [cacheDone, currentSeries, first, imgIndexs, seriesIndex]);

  // 鼠标滚轮切换图片
  const wheelChange = useCallback(
    (event: WheelEvent): void => {
      const { deltaY } = event;
      if (isPlay) pause();
      if (deltaY > 0) isMpr ? nextMpr() : next();
      if (deltaY < 0) isMpr ? prevMpr() : prev();

      event.preventDefault();
    },
    [isMpr, isPlay, next, nextMpr, pause, prev, prevMpr],
  );

  // 显示所有 动作&信息面板
  const showPanels = (isFullscreen: boolean, isShowPanels: boolean): void => {
    if (isFullscreen) {
      if (!isShowPanels) {
        setShowPanels(true);
      } else {
        window.clearTimeout(showPanelsTimer);
        showPanelsTimer = window.setTimeout(() => {
          setShowPanels(false);
          window.clearTimeout(showPanelsTimer);
        }, 1000);
      }
    }
  };

  // 获取渲染坐标
  // const getDrawInfo = useCallback(
  //   (width: number, height: number): ImgDrawInfoI => {
  //     const [canvasWidth, canvasHeight] = viewportSize;
  //     return getRangeInfo(canvasWidth, canvasHeight, width, height);
  //   },
  //   [viewportSize],
  // );

  // 获取MPR模式下绘制图片的必要信息
  const getMprDrawInfo = useCallback(
    (size: MprImgAndSizeI[]): ImgDrawInfoI[] => {
      const [canvasWidth, canvasHeight] = viewportSize;
      let totalWidth = 0,
        totalHeight = 0;

      if (isFullscreen) {
        const selectedImg = size[mprSeriesIndex - 1];
        const otherImgs: MprImgAndSizeI[] = [];
        const selectedWidth = (canvasWidth * 2) / 3;
        const selectedHeight = canvasHeight;
        const otherWidth = (canvasWidth * 1) / 3;
        const otherHeight = canvasHeight / 2;

        size.forEach((item, index) => {
          if (index !== mprSeriesIndex - 1) otherImgs.push(item);
        });

        const selectedInfo = getDrawInfo(
          selectedWidth,
          selectedHeight,
          selectedImg.width,
          selectedImg.height,
        );
        const topInfo = getDrawInfo(
          otherWidth,
          otherHeight,
          otherImgs[0].width,
          otherImgs[0].height,
        );
        const bottomInfo = getDrawInfo(
          otherWidth,
          otherHeight,
          otherImgs[1].width,
          otherImgs[1].height,
        );

        topInfo.x += selectedWidth;
        bottomInfo.x += selectedWidth;
        bottomInfo.y += otherHeight;
        return [
          { ...selectedInfo, img: selectedImg.img },
          { ...topInfo, img: otherImgs[0].img },
          { ...bottomInfo, img: otherImgs[1].img },
        ];
      } else {
        const viewWidth = canvasWidth - 4 * devicePixelRatio;
        const viewHeight = canvasHeight - 2 * devicePixelRatio;
        size.forEach((img) => {
          /* 
            // ====== 当非全屏时 ====
            并排排列，先求出3张图片宽度总和 && 最高的高度 然后计算渲染位置并输出
          
          */
          totalWidth += img.width;
          totalHeight = Math.max(totalHeight, img.height);
        });

        if (viewWidth / totalWidth < viewHeight / totalHeight) {
          const drawW = viewWidth;
          const drawH = (drawW * totalHeight) / totalWidth;
          const initDrawY = (viewHeight - drawH) / 2;
          const scaleNum = drawW / totalWidth;
          let drawX = 1 * devicePixelRatio;

          return size.map((item) => {
            const result = {
              x: drawX,
              y: initDrawY,
              width: item.width * scaleNum,
              height: item.height * scaleNum,
              img: item.img,
            };

            drawX += result.width + 1 * devicePixelRatio;
            return result;
          });
        } else {
          const drawH = viewHeight;
          const drawW = (drawH * totalWidth) / totalHeight;
          const initDrawX = (viewWidth - drawW) / 2;
          const scaleNum = drawW / totalHeight;
          let drawX = initDrawX;

          return size.map((item) => {
            const result = {
              img: item.img,
              x: drawX,
              y: 1 * devicePixelRatio,
              width: item.width * scaleNum,
              height: item.height * scaleNum,
            };

            drawX += result.width + 1 * devicePixelRatio;
            return result;
          });
        }
      }
    },
    [viewportSize, isFullscreen, mprSeriesIndex],
  );

  // 绘制图片
  const drawNormal = useCallback(
    (ctx: CanvasRenderingContext2D): void => {
      if (!cache) return;
      const currentCache = cache[seriesIndex - 1];
      if (!currentCache) return;
      const currentImg = currentCache[imgIndexs[seriesIndex - 1] - 1];
      if (!currentImg) return;

      const { scale, offset } = fns;

      const { width, height } = currentImg;
      const drawInfo = getDrawInfo(viewportSize[0], viewportSize[1], width, height, scale);

      ctx.clearRect(0, 0, viewportSize[0], viewportSize[1]);
      ctx.drawImage(
        currentImg,
        0,
        0,
        width,
        height,
        drawInfo.x + offset[0] * devicePixelRatio,
        drawInfo.y + offset[1] * devicePixelRatio,
        drawInfo.width,
        drawInfo.height,
      );

      if (showLungNodules === 1 && lungNodule && currentNodule && currentSeries) {
        const { series_id } = lungNodule;

        if (currentSeries.id !== series_id) return;

        const imgIndex = imgIndexs[seriesIndex - 1];
        const { disp_z, img_x, img_y, rad_pixel } = currentNodule;

        if (disp_z + 1 === imgIndex) {
          const widthRatio = drawInfo.width / currentImg.width;
          const heightRatio = drawInfo.height / currentImg.height;

          const drawX = widthRatio * img_x + drawInfo.x + offset[0] * devicePixelRatio;
          const drawY = heightRatio * img_y + drawInfo.y + offset[1] * devicePixelRatio;

          ctx.beginPath();
          ctx.strokeStyle = "red";
          ctx.lineWidth = devicePixelRatio;
          ctx.arc(
            drawX,
            drawY,
            Math.max(6 * devicePixelRatio, (rad_pixel + 2) * widthRatio),
            0,
            Math.PI * 2,
          );
          ctx.stroke();
          ctx.closePath();
        }
      }
    },
    [cache, imgIndexs, seriesIndex, viewportSize, currentNodule, fns],
  );

  // 绘制MPR模式下的图片
  const drawMpr = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!currentSeries) return;
      if (isMpr && !mprCache.size) return;
      const currentCache = mprCache.get(currentSeries.id);
      if (!currentCache) return;
      const imgs = [
        currentCache[0][mprImgIndexs[0] - 1],
        currentCache[1][mprImgIndexs[1] - 1],
        currentCache[2][mprImgIndexs[2] - 1],
      ];

      const drawInfo = getMprDrawInfo(
        imgs.map((img) => ({
          img,
          width: img.width * devicePixelRatio,
          height: img.height * devicePixelRatio,
        })),
      );
      setMprImgRange(drawInfo);
      ctx.clearRect(0, 0, viewportSize[0], viewportSize[1]);

      drawInfo.forEach((info, index) => {
        const { x, y, width, height, img } = info;
        ctx.drawImage(
          img,
          0,
          0,
          img.width / devicePixelRatio,
          img.height / devicePixelRatio,
          x,
          y,
          width,
          height,
        );
        if (!isFullscreen && index === mprSeriesIndex - 1) {
          ctx.strokeStyle = "#7398FF";
          ctx.lineWidth = 1 * devicePixelRatio;

          ctx.beginPath();
          ctx.moveTo(x - 1, y - 1);
          ctx.lineTo(x - 1 + width + 2, y - 1);
          ctx.lineTo(x - 1 + width + 2, y - 1 + height + 2);
          ctx.lineTo(x - 1, y - 1 + height + 2);
          ctx.lineTo(x - 1, y - 1);
          ctx.stroke();
        }
      });
      // ctx.clearRect(0, 0, width, height);
    },
    [
      currentSeries,
      getMprDrawInfo,
      isFullscreen,
      isMpr,
      mprCache,
      mprImgIndexs,
      mprSeriesIndex,
      viewportSize,
    ],
  );

  // 更新视图
  const updateViewport = useCallback(() => {
    if (!ctx) return;

    if (isMpr) drawMpr(ctx);
    else drawNormal(ctx);
  }, [ctx, drawMpr, drawNormal, isMpr]);

  // 显示Mpr
  const showMpr = (mpr: boolean): void => {
    if (!mpr || !currentSeries || !cacheDone) return;
    if (isMpr) return setIsMpr(false);

    setProgress(0);
    setIsMpr(true);
    getMprSeries(currentSeries.id)
      .then((result) => {
        const { id } = result;
        const pictures = result.pictures as ImageI[][];
        const picTotalCount = pictures[0].length + pictures[1].length + pictures[2].length;

        const cacheMprSeries = mprCache.get(id);

        // 如果存在缓存 && 缓存的所有图片数量与原始图片数量相同 则不往下进行
        if (
          cacheMprSeries &&
          cacheMprSeries[0].length + cacheMprSeries[1].length + cacheMprSeries[2].length ===
            picTotalCount
        )
          return;

        setCacheDone(false);
        const _cache: HTMLImageElement[][] = [];
        let mprCount = 0;
        let progressCount = 0;

        pictures.forEach((pics) => {
          const currentPicsCache: HTMLImageElement[] = [];
          let imgCount = 0;
          pics.forEach((pic, index) => {
            const { url, mpr_order } = pic;
            const $img = new Image();
            $img.src = url;
            $img.onload = (): void => {
              currentPicsCache[index] = $img;
              imgCount += 1;
              progressCount += 1;
              setProgress((progressCount * 100) / picTotalCount);
              if (imgCount === pics.length) {
                // _cache[mpr_order] = currentPicsCache;
                _cache[mpr_order] = currentPicsCache; // 这里需要用mpr_order 目前没有提供
                mprCount += 1;
                if (mprCount === pictures.length) {
                  setMprCache(mprCache.set(id, _cache));
                  setCacheDone(true);
                }
              }
            };
          });
        });
      })
      .catch((err) => console.error(err));
  };

  // 选择MPR模式下的图片
  const selectMprImg = (e: MouseEvent): void => {
    if (!isMpr || !$viewport.current) return;
    const { left, top } = $viewport.current.getClientRects()[0];
    const mouseX = (e.clientX - left) * devicePixelRatio;
    const mouseY = (e.clientY - top) * devicePixelRatio;

    for (let i = 0; i < mprImgRange.length; i++) {
      const { x, y, width, height } = mprImgRange[i];
      if (mouseX >= x && mouseY >= y && mouseX <= x + width && mouseY <= y + height) {
        if (isFullscreen) {
          const TEMP = [0, 1, 2].filter((item) => item !== mprSeriesIndex - 1); // 获取全屏模式下另外两个图像的index
          if (i !== 0) {
            return setMprSeriesIndex(TEMP[i - 1] + 1);
            // return updateViewport();
          }
        }
        return setMprSeriesIndex(i + 1);
      }
    }
  };
  /* =============== use effect =============== */
  useEffect(() => {
    // 修改root的背景色
    const $wrapper = document.getElementById("defaultLayout");

    if ($wrapper && $viewport.current) {
      const classNameCache = $wrapper.className;
      $wrapper.className = `${$wrapper.className} theme-dark`;

      $viewport.current.addEventListener("wheel", wheelChange, { passive: false });
      return (): void => {
        $wrapper.className = classNameCache;
        $viewport.current && $viewport.current.removeEventListener("wheel", wheelChange);
      };
    }
  }, [wheelChange]);
  useEffect(() => {
    init(id)
      .then(() => console.log("init successed"))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    // 更新当前序列的图片缓存
    if (!seriesList || !seriesMap) return;
    if (!currentSeries || !currentSeries.pictures) return;
    if (seriesMap.size !== seriesList.children.length) return;
    const currentCache = cache[seriesIndex - 1];

    if (currentCache && currentCache.length === currentSeries.pictures.length) {
      setCacheDone(true);
      return;
    }

    const pics = currentSeries.pictures as ImageI[];
    const _imgs: HTMLImageElement[] = [];
    let count = 0;

    pics.forEach((pic, index) => {
      const $img = new Image();
      $img.src = pic.url;
      $img.onload = (): void => {
        _imgs[index] = $img;
        count += 1;
        setProgress((count / pics.length) * 100);
        if (count === pics.length) {
          const nextCache = [...cache];
          nextCache[seriesIndex - 1] = _imgs;
          setCache(nextCache);
          setCacheDone(true);
        }
      };
      $img.onerror = (err): void => {
        _imgs[index] = imgLoadErr;
        count += 1;
        setProgress((count / pics.length) * 100);
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSeries, seriesIndex, seriesList, seriesMap]);
  useEffect(() => {
    // 监听fullscreen event
    if ($player && $player.current) {
      const { current } = $player;
      const fullscreenChange = (): void => {
        setFullscreen(!isFullscreen);
      };
      const fullscreenError = (): void => {
        alert("您的浏览器不支持全屏显示");
      };

      current.addEventListener("fullscreenchange", fullscreenChange);
      current.addEventListener("webkitfullscreenchange", fullscreenChange);
      current.addEventListener("fullscreenerror", fullscreenError);

      return (): void => {
        if (current) {
          current.removeEventListener("fullscreenchange", fullscreenChange);
          current.removeEventListener("webkitfullscreenchange", fullscreenChange);
          current.removeEventListener("fullscreenerror", fullscreenError);
        }
      };
    }
  }, [isFullscreen]);
  useEffect(() => {
    const onKeydown = (e: KeyboardEvent): void => {
      if (!cacheDone) return;

      switch (e.keyCode) {
        case LEFT:
          isPlay && pause();
          isMpr ? prevMpr() : prev();
          break;
        case RIGHT:
          isPlay && pause();
          isMpr ? nextMpr() : next();
          break;
        case UP:
          !isMpr && prevSeries();
          break;
        case DOWN:
          !isMpr && nextSeries();
          break;
        case PLAY_PAUSE:
          isPlay ? pause() : play();
          // setPlay(!isPlay);
          break;
        case ZOOM_IN:
          isPlay && pause();
          updateFnStatus("scale", fns.scale + 0.1);
          break;
        case ZOOM_OUT:
          isPlay && pause();
          updateFnStatus("scale", fns.scale - 0.1);
          break;
        case MOVE:
          isPlay && pause();
          updateFnStatus("move", true);
          break;
        case RESET:
          isPlay && pause();
          resetFns();
          break;
        default:
          return;
      }

      e.preventDefault();
    };

    const onKeyup = (e: KeyboardEvent) => {
      if (!cacheDone) return;

      switch (e.keyCode) {
        case MOVE:
          isPlay && pause();
          updateFnStatus("move", false);
          break;
        default:
          break;
      }

      e.preventDefault();
    };

    document.addEventListener("keydown", onKeydown, { passive: false });
    document.addEventListener("keyup", onKeyup, { passive: false });

    return (): void => {
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("keyup", onKeyup);
    };
  }, [isPlay, isMpr, next, nextSeries, prev, prevSeries, prevMpr, nextMpr, pause, play, fns]);
  useEffect(() => {
    // 更新 canvas 视图
    playTimer !== undefined && window.clearTimeout(playTimer);
    if (isPlay) {
      playTimer = window.setTimeout(
        () => {
          isMpr ? nextMpr() : next();
        },
        currentSeries ? currentSeries.display_frame_rate : 300,
      );
    }

    if (showLungNodules === 1 && lungNodule) {
      if (currentNodule) {
        const { disp_z } = currentNodule;

        if (disp_z + 1 !== imgIndexs[seriesIndex - 1]) {
          setCurrentNodule(undefined);
        }
      } else {
        const { nodule_details } = lungNodule;
        if (nodule_details) {
          const _currentNodule = nodule_details.find(
            (item) => item.disp_z + 1 === imgIndexs[seriesIndex - 1],
          );

          setCurrentNodule(_currentNodule);
        }
      }
    }

    updateViewport();
  }, [
    imgIndexs,
    seriesIndex,
    isPlay,
    next,
    viewportSize,
    updateViewport,
    mprSeriesIndex,
    currentSeries,
    isMpr,
    nextMpr,
    currentNodule,
    showLungNodules,
    lungNodule,
  ]);
  useEffect(() => {
    // 重新计算canvas的width height
    const { outerWidth, outerHeight, devicePixelRatio = 1 } = window;
    let width = VIEWPORT_WIDTH_DEFAULT,
      height = VIEWPORT_HEIGHT_DEFAULT;

    if (isMpr) {
      width = MPR_VIEWPORT_WIDTH_DEFAULT;
      height = MPR_VIEWPORT_HEIGHT_DEFAULT;
    }

    if (isFullscreen) {
      width = outerWidth;
      height = outerHeight;
    }

    width *= devicePixelRatio;
    height *= devicePixelRatio;

    setViewportSize([width, height]);
  }, [isFullscreen, isMpr]);
  useEffect(() => {
    if ($viewport && $viewport.current && !ctx) {
      const _ctx = $viewport.current.getContext("2d");
      _ctx && setCtx(_ctx);
    }
  }, [ctx]);

  const listenMouseStart = (e: globalThis.MouseEvent) => {
    if ($viewport.current) {
      mouseStartPoint = [e.offsetX, e.offsetY];
      isMoving = true;
    }
  };

  const listenMouseMove = (e: globalThis.MouseEvent) => {
    if (isMoving) {
      const { offsetX, offsetY } = e;
      const [startX, startY] = mouseStartPoint;
      const [cacheX, cacheY] = cacheOffset;

      updateFnStatus("offset", [offsetX - startX + cacheX, offsetY - startY + cacheY]);
    }
  };

  const listenMouseEnd = (e: globalThis.MouseEvent) => {
    isMoving = false;
    cacheOffset = fns.offset;
  };

  useEffect(() => {
    if (!$viewport.current) return;

    if (fns.move) {
      $viewport.current.addEventListener("mousedown", listenMouseStart);
      $viewport.current.addEventListener("mousemove", listenMouseMove);
      $viewport.current.addEventListener("mouseup", listenMouseEnd);
    } else {
      $viewport.current.removeEventListener("mousedown", listenMouseStart);
      $viewport.current.removeEventListener("mousemove", listenMouseMove);
      $viewport.current.removeEventListener("mouseup", listenMouseEnd);
    }

    return (): void => {
      if ($viewport.current) {
        $viewport.current.removeEventListener("mousedown", listenMouseStart);
        $viewport.current.removeEventListener("mousemove", listenMouseMove);
        $viewport.current.removeEventListener("mouseup", listenMouseEnd);
      }
    };
  }, [fns]);
  useEffect(() => {
    document.oncontextmenu = (): boolean => false;
    document.oncopy = (): boolean => false;
  }, []);
  /* =============== components =============== */
  const seriesListCmp = (list?: SeriesListI): ReactNode => {
    if (!list)
      return (
        <div className="player-list">
          <span className="player-list-count">no series</span>
        </div>
      );

    const { children } = list;

    return (
      <div className="player-list">
        <span className="player-list-count">{`${seriesIndex} / ${children.length}`}</span>
        <Scrollbars
          autoHide
          className="player-list-scrollbar"
          renderThumbVertical={(props): ReactElement => (
            <div {...props} className="player-list-vertical-thumb"></div>
          )}
          renderView={(props): ReactElement => <ul {...props} className="player-list-inner"></ul>}
        >
          {children.map((item, index) => {
            const { id, thumbnail, mpr_flag } = item;

            return (
              <li
                key={id}
                className={`player-list-item ${index + 1 === seriesIndex ? "active" : ""}`}
                onClick={(): void => changeSeries(id)}
              >
                <span className="player-list-item-mask">
                  {index + 1}
                  <span>{mpr_flag ? "mpr" : ""}</span>
                </span>
                <img src={thumbnail} alt={id} />
              </li>
            );
          })}
        </Scrollbars>
      </div>
    );
  };

  const getMarks = () => {
    if (!showLungNodules || !lungNodule || !currentSeries) return null;
    const { nodule_details, series_id } = lungNodule;
    if (series_id !== currentSeries.id || !nodule_details || !nodule_details.length) return null;

    const data = [...nodule_details].reverse();

    return (
      <div className="player-marks">
        <div className="player-marks-title">肺结节：</div>
        <Scrollbars
          renderThumbHorizontal={(props) => {
            const { style, ...args } = props;

            return (
              <div
                style={{
                  ...style,
                  ...{
                    backgroundColor: "rgba(255,255,255,.6)",
                    borderRadius: "4px",
                  },
                }}
                {...args}
              ></div>
            );
          }}
        >
          <div className="player-marks-content">
            {data.map((nodule) => {
              const { id, image_details, disp_z } = nodule;

              return (
                <div
                  className={`player-marks-item${
                    currentNodule && currentNodule.id === id ? " active" : ""
                  }`}
                  key={id}
                  style={{ backgroundImage: `url(${image_details.z_image_tag})` }}
                  onClick={(): void => {
                    const next = [...imgIndexs];
                    next[seriesIndex - 1] = disp_z + 1;
                    setImgIndexs(next);
                    setCurrentNodule(nodule);
                  }}
                ></div>
              );
            })}
          </div>
        </Scrollbars>
      </div>
    );
  };

  const slider = (): ReactElement => {
    let max = 1;
    if (currentSeries) {
      const { id, pictures } = currentSeries;
      if (isMpr) {
        const currentMprCache = mprCache.get(id);
        if (currentMprCache && currentMprCache[mprSeriesIndex - 1].length) {
          max = currentMprCache[mprSeriesIndex - 1].length;
        }
      } else if (pictures) {
        max = pictures.length || 1;
      }
    }

    return (
      <div className="player-ctl-slider">
        {/* {getMarks(max)} */}
        <Slider
          value={isMpr ? mprImgIndexs[mprSeriesIndex - 1] : imgIndexs[seriesIndex - 1]}
          min={1}
          step={1}
          max={max}
          disabled={!cacheDone}
          // marks={marks}
          getTooltipPopupContainer={(): HTMLElement => $player.current || document.body}
          onChange={(value: number): void => {
            let _indexs = imgIndexs,
              _seriesIndex = seriesIndex,
              _updateImgIndexs = setImgIndexs;
            if (isMpr) {
              _indexs = mprImgIndexs;
              _seriesIndex = mprSeriesIndex;
              _updateImgIndexs = setMprImgIndexs;
            }
            const next = [..._indexs];
            next[_seriesIndex - 1] = value;
            _updateImgIndexs(next);
          }}
        ></Slider>
      </div>
    );
  };
  const ctlbtns = (isShowInfo: boolean, mpr: boolean): ReactElement => {
    return (
      <div className="player-ctl-btns">
        {isShowInfo ? (
          <EyeOutlined
            className="iconfont active"
            onClick={(): void => {
              cacheDone && setShowInfo(!isShowInfo);
            }}
          ></EyeOutlined>
        ) : (
          <EyeInvisibleOutlined
            className="iconfont"
            onClick={(): void => {
              cacheDone && setShowInfo(!isShowInfo);
            }}
          ></EyeInvisibleOutlined>
        )}
        <i
          // className={`iconfont icon-ic iconic_mpr player-mpr-btn ${mpr ? "" : "disabled"} ${
          //   isMpr ? "active" : ""
          // }`}
          className={`iconfont icon-ic iconic_mpr player-mpr-btn disabled`}
        ></i>
        {isFullscreen ? (
          <FullscreenExitOutlined
            className="iconfont active"
            onClick={(): void => changeFullscreen(isFullscreen)}
          ></FullscreenExitOutlined>
        ) : (
          <FullscreenOutlined
            className="iconfont"
            onClick={(): void => changeFullscreen(isFullscreen)}
          ></FullscreenOutlined>
        )}
      </div>
    );
  };
  /* =============== render element =============== */
  let className = "player";
  if (isFullscreen) className += " player-fullscreen";
  if (isShowPanels) className += " player-show-panels";

  const { scale, move } = fns;

  return (
    <section id="oldPlayer" className={className}>
      <div className="player-header">
        <div className="player-header-info">
          <h1 className="player-header-title">医影浏览器</h1>
          <i
            className="player-header-shortcut-btn iconfont iconic_help"
            onClick={(): void => setShowShortcut(true)}
          ></i>
        </div>
        <div className="player-header-btns">
          <Tag
            color="purple"
            className="switch-new-player"
            onClick={(): void => {
              switchPlayerVersion(true);
            }}
          >
            切换新版医影浏览器
          </Tag>
          <LinkButton
            className="player-header-back"
            to="/resources"
            icon={<ArrowLeftOutlined />}
            type="light"
          >
            返回
          </LinkButton>
        </div>
      </div>
      <div className="player-content" ref={$player}>
        <div className={`player-view ${isMpr ? "player-mpr" : ""}`}>
          {seriesListCmp(seriesList)}
          <div className="player-view-inner">
            <Shortcut show={showShortcut} onClose={(): void => setShowShortcut(false)}></Shortcut>
            <canvas
              className={`player-viewport${fns.move ? " move-mode" : ""}`}
              ref={$viewport}
              // onWheel={wheelChange}
              onMouseOut={(): void => window.clearTimeout(showPanelsTimer)}
              onMouseOver={(): void => showPanels(isFullscreen, isShowPanels)}
              onMouseMove={(): void => showPanels(isFullscreen, isShowPanels)}
              onClick={selectMprImg}
              width={viewportSize[0]}
              height={viewportSize[1]}
            ></canvas>
            <Fns
              isMove={move}
              onMove={(): void => {
                if (!cacheDone) return;
                updateFnStatus("move", !move);
              }}
              onZoomIn={(): void => {
                if (!cacheDone) return;
                updateFnStatus("scale", scale + 0.1);
              }}
              onZoomOut={(): void => {
                if (!cacheDone) return;
                updateFnStatus("scale", scale - 0.1);
              }}
              onReset={(): void => {
                if (!cacheDone) return;
                resetFns();
              }}
            ></Fns>
            <div className="player-progress" style={{ display: cacheDone ? "none" : "flex" }}>
              <span>{Math.ceil(progress)}%</span>
              <Progress percent={progress} strokeColor="#7594FF"></Progress>
              <span>Loading...</span>
            </div>
          </div>
          <PatientInfo
            seriesIndex={seriesIndex}
            imageIndex={isMpr ? mprImgIndexs[mprSeriesIndex - 1] : imgIndexs[seriesIndex - 1]}
            imageIndexMax={currentSeries ? currentSeries.pictures.length : 1}
            currentSeries={currentSeries}
            show={isShowInfo}
            patientInfo={patient}
            nodule={currentNodule}
          ></PatientInfo>
        </div>
        {getMarks()}
        <div className={`player-ctl ${cacheDone ? "" : "player-disabled"}`}>
          <div className="player-ctl-playbtns">
            {isPlay ? (
              <PauseOutlined className="iconfont iconfont-isPlay" onClick={pause}></PauseOutlined>
            ) : (
              <CaretRightOutlined
                className="iconfont iconfont-isPlay"
                onClick={play}
              ></CaretRightOutlined>
            )}
            <StepBackwardOutlined
              className="iconfont"
              onClick={(): void => {
                isPlay && pause();
                isMpr ? firstMpr() : first();
              }}
            ></StepBackwardOutlined>
            <LeftOutlined
              className="iconfont"
              onClick={(): void => {
                isPlay && pause();
                isMpr ? prevMpr() : prev();
              }}
            ></LeftOutlined>
            {slider()}
            <RightOutlined
              className="iconfont"
              onClick={(): void => {
                isPlay && pause();
                isMpr ? nextMpr() : next();
              }}
            ></RightOutlined>
            <StepForwardOutlined
              className="iconfont"
              onClick={(): void => {
                isPlay && pause();
                isMpr ? lastMpr() : last();
              }}
            ></StepForwardOutlined>
          </div>
          {ctlbtns(isShowInfo, currentSeries ? !!currentSeries.mpr_flag : false)}
        </div>
      </div>
    </section>
  );
};

export default Player;
