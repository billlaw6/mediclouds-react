import { publicReq } from "_axios";
import { LungNoduleReportI } from "_types/ai";

export type ReportTypeT = "simple" | "full" | "rebuild"; // 报告类型

/* 肺结节筛查 */

/**
 * 获取某个肺结节筛查报告
 *
 * @param {string} examId 检查id
 * @returns {Promise<LungNoduleReportI>}
 */
export const getLungNoduleReport = async (examId: string): Promise<LungNoduleReportI> =>
  await publicReq({
    url: `/ai/lung-nodules/${examId}/`,
    method: "GET",
  });

/**
 * 对某个检查生成报告
 *
 * @param {string} examId 检查id
 * @param {ReportTypeT} [type] 生成报告的类型
 * @returns {Promise<LungNoduleReportI>}
 */
export const generateLungNodule = async (examId: string, type?: ReportTypeT): Promise<0 | 1> =>
  await publicReq({
    url: "/ai/lung-nodules/generate/",
    method: "POST",
    data: {
      id: examId,
      type,
    },
  });

/**
 * 删除某几个报告，返回已删除的报告id列表
 *
 * @param {string[]} ids 报告id数组
 * @returns {Promise<string[]>}
 */
export const delLungNodules = async (ids: string[]): Promise<string[]> =>
  await publicReq({
    url: "/ai/lung-nodules/del/",
    method: "POST",
    data: {
      id: ids,
    },
  });
