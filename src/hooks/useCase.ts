import { useDispatch, useSelector } from "react-redux";
import {
  createCase,
  delCases,
  getCase,
  getCaseList,
  getSharedCaseList,
  updateCaseStamp,
  CaseI,
  CaseTypeE,
  CreateCaseDataI,
} from "mc-api";
import { StoreStateI } from "_types/core";
import { CaseActionE } from "_types/case";

export default () => {
  const dispatch = useDispatch();
  const { cases, settings } = useSelector<
    StoreStateI,
    { cases: StoreStateI["cases"]; settings: StoreStateI["settings"] }
  >((state) => ({ cases: state.cases, settings: state.settings }));

  /** 获取自己的病例列表 */
  const fetchMineCaseList = (): void => {
    getCaseList()
      .then((res) => {
        dispatch({ type: CaseActionE.GET_MINE_LIST, payload: res });
      })
      .catch((err) => console.error(err));
  };

  const _createCase = async (info: CreateCaseDataI): Promise<CaseI> => await createCase(info);

  /** 获取查看过的其他人分享的病例列表 */
  const fetchReadRecordCaseList = (): void => {
    getSharedCaseList()
      .then((res) => {
        dispatch({ type: CaseActionE.GET_READ_RECORD_LIST, payload: res });
      })
      .catch((err) => console.error(err));
  };

  const _getCase = async (id: string): Promise<CaseI> => {
    try {
      return await getCase(id);
    } catch (error) {
      throw new Error(error);
    }
  };

  const _delCase = async (ids: number[]): Promise<void> => {
    try {
      await delCases(ids);
      await fetchMineCaseList();
    } catch (error) {
      throw new Error(error);
    }
  };

  /** 更新case tab */
  const updateCaseTabType = (type: CaseTypeE): void => {
    dispatch({ type: CaseActionE.SWITCH_CASE_TAB_TYPE, payload: type });
  };

  const selectCase = (data?: CaseI): void => {
    dispatch({ type: CaseActionE.SELECT_CASE, payload: data });
  };

  return {
    cases,
    settings,
    createCase: _createCase,
    delCase: _delCase,
    fetchMineCaseList,
    fetchReadRecordCaseList,
    getCase: _getCase,
    updateCaseTabType,
    updateCaseStamp,
    selectCase,
  };
};
