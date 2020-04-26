import { call, put, takeEvery } from "redux-saga/effects";
import { updateUserAction, logoutUserAction } from "_actions/user";
import { getExamIndexListAction, deleteExamIndexListAction } from "_actions/dicom";
import { logoutUser, updateUserInfo } from "_services/user";
import { getExamIndex, deleteExamIndex } from "_services/dicom";
import * as types from "../store/action-types";
import { push } from "connected-react-router";
// import { store } from "../index";

// worker Saga : 将在 action 被 dispatch 时调用
// 用户信息修改页发出updateUserAction
function* updateUserEffect(action: ReturnType<typeof updateUserAction>) {
  try {
    const res = yield call(updateUserInfo, action.payload);
    // console.group("==== formData In Saga ====");
    // action.payload.forEach((value, key) => {
    //   console.log("Key: ", key, "  Value: ", value);
    // });
    // console.groupEnd();
    console.log(res.data);
    yield put({ type: types.SET_USER, payload: res.data });
  } catch (error) {
    console.error(error);
    yield put(push("/profile"));
  }
}

function* logoutUserEffect(action: ReturnType<typeof logoutUserAction>) {
  try {
    const res = yield call(logoutUser);
    yield put({ type: types.SET_EXAM_INDEX_LIST, payload: [] });
    yield put({ type: types.SET_TOKEN, payload: "" });
    yield put({ type: types.SET_USER, payload: {} });
    yield put(push("/login"));
  } catch (error) {
    console.error(error);
  }
}

function* getExamIndexEffect(action: ReturnType<typeof getExamIndexListAction>) {
  try {
    console.log(action.payload);
    const res = yield call(getExamIndex, action.payload);
    // console.log(typeof JSON.parse(res.data));
    console.log(res.data);
    // put对应redux中的dispatch。
    yield put({ type: types.SET_EXAM_INDEX_LIST, payload: res.data });
  } catch (error) {
    console.log(error.response);
  }
}

function* deleteExamIndexEffect(action: ReturnType<typeof deleteExamIndexListAction>) {
  try {
    const res = yield call(deleteExamIndex, action.payload);
    // 删除操作后用默认条件再获取一次结果，页面中暂未设定查询条件
    const defaultExamIndexSearchForm = {};
    yield put({ type: types.GET_EXAM_INDEX_LIST, payload: defaultExamIndexSearchForm });
  } catch (error) {
    console.log(error.response);
  }
}

// function* formLoginE(action: ReturnType<typeof submitLoginFormAction>) {
//   try {
//     const res = yield call(loginUser, action.payload);
//     yield put({ type: types.SET_TOKEN, payload: { token: res.data.key } });
//     yield put({ type: types.SET_USER, payload: { token: res.data.user_info } });
//     yield put(push("/"));
//   } catch (error) {
//     console.log(error.response);
//     // 登录失败先清空本地token，防止无效token判定。
//     yield put({ type: types.SET_TOKEN, payload: "" });
//     if (error.response) {
//       const failedPayload = {
//         ...action.payload,
//         message: error.response.data.non_field_errors,
//       };
//       console.log(failedPayload);
//     }
//   }
//   try {
//     const res = yield call(getUserInfo);
//     // console.log(res);
//     // console.log(store.getState().currentUser);
//     // 在原状态上部分更新
//     const currentUserInfo = {
//       ...store.getState().currentUser,
//       ...res.data,
//     };
//     // console.log(currentUserInfo);
//     yield put({ type: types.SET_CURRENT_USER, payload: currentUserInfo });
//   } catch (error) {
//     console.log("get info error");
//     console.log(error.response);
//     yield put(push("/login/"));
//   }
// }

function* rootSaga() {
  yield takeEvery(types.UPDATE_USER, updateUserEffect);
  yield takeEvery(types.LOGOUT_USER, logoutUserEffect);
  yield takeEvery(types.GET_EXAM_INDEX_LIST, getExamIndexEffect);
  yield takeEvery(types.DELETE_EXAM_INDEX_LIST, deleteExamIndexEffect);
}

export default rootSaga;
