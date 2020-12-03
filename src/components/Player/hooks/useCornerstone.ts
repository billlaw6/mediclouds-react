import dicomParser from "dicom-parser";
import cornerstone from "cornerstone-core";
import cornerstoneTools from "cornerstone-tools";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import cornerstoneMath from "cornerstone-math";
import Hammer from "hammerjs";

interface UserCornerstonePropsI {
  /** Events */
  onLoadProgress?: () => void; // 当数据加载时
}

/**
 * 初始化cornerstone 和 tools
 *
 * @param {UserCornerstonePropsI} props
 */
export const useCornerstone = (props: UserCornerstonePropsI = {}) => {
  const { onLoadProgress } = props;

  /** 初始化cs相关 */
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.configure({
    useWebWorkers: false,
    onloadend: () => onLoadProgress && onLoadProgress(),
  });

  /** 初始化 cs 工具 */
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
  cornerstoneTools.init();
  if (process.env.NODE_ENV === "development") cornerstoneTools.enableLogger();

  return {
    cornerstone,
    cornerstoneTools,
    cornerstoneWADOImageLoader,
  };
};
