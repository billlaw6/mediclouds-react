import { useDispatch, useSelector } from "react-redux";
import { generateLungNodule } from "_api/ai";
import { AiReportActionE, LungNoduleReportI } from "_types/ai";
import { StoreStateI } from "_types/core";

export default () => {
  const { lungNodule } = useSelector<StoreStateI, StoreStateI["aiReport"]>(
    (state) => state.aiReport,
  );
  const dispatch = useDispatch();

  /** 更新当前的肺结节筛查 */
  const updateLungNodule = (report?: LungNoduleReportI): void => {
    dispatch({ type: AiReportActionE.UPDATE_LUNG_NODULE, payload: report });
  };

  /** 生成完整版肺结节筛查报告 */
  const generateFullLungNodule = async (examId: string): Promise<void> => {
    try {
      const res = await generateLungNodule(examId, "full");
      updateLungNodule(res);
    } catch (error) {
      throw new Error(error);
    }
  };

  return { lungNodule, updateLungNodule, generateFullLungNodule };
};
