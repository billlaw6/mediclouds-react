import { useDispatch, useSelector } from "react-redux";
import { getCase, getMineCaseList, getSharedCaseList } from "_api/case";
import { CaseActionE, CaseI, CaseTypeE } from "_types/case";
import { StoreStateI } from "_types/core";

export default () => {
  const dispatch = useDispatch();
  const { cases, settings } = useSelector<
    StoreStateI,
    { cases: StoreStateI["cases"]; settings: StoreStateI["settings"] }
  >((state) => ({ cases: state.cases, settings: state.settings }));

  /** 获取自己的病例列表 */
  const fetchMineCaseList = (): void => {
    getMineCaseList()
      .then((res) => {
        dispatch({ type: CaseActionE.GET_MINE_LIST, payload: res });
      })
      .catch((err) => console.error(err));
  };

  /** 获取查看过的其他人分享的病例列表 */
  const fetchReadRecordCaseList = (): void => {
    getSharedCaseList()
      .then((res) => {
        dispatch({ type: CaseActionE.GET_READ_RECORD_LIST, payload: res });
      })
      .catch((err) => console.error(err));
  };

  const _getCase = async (id: string): Promise<CaseI> => await getCase(id);

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
    fetchMineCaseList,
    fetchReadRecordCaseList,
    getCase: _getCase,
    updateCaseTabType,
    selectCase,
  };
};
