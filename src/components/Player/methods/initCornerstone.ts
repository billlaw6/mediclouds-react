import dicomParser from "dicom-parser";
import cornerstone from "cornerstone-core";
import cornerstoneTools from "cornerstone-tools";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import cornerstoneMath from "cornerstone-math";
import Hammer from "hammerjs";

export default () => {
  /** 初始化cs相关 */
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.configure({
    useWebWorkers: false,
  });

  /** 初始化 cs 工具 */
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
  cornerstoneTools.init({
    // showSVGCursors: true,
  });
  cornerstoneTools.toolColors.setActiveColor("#E36B00");
  cornerstoneTools.toolColors.setToolColor("#F7E107");
  if (process.env.NODE_ENV === "development") cornerstoneTools.enableLogger();

  return {
    cs: cornerstone,
    cst: cornerstoneTools,
    csImgLoader: cornerstoneWADOImageLoader,
  };
};
