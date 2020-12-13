import { Reducer } from "redux";
import {
  PlayerMarkI,
  PlayerMarksActionE,
  PlayerMarksAddMarkPayloadI,
  PlayerMarksDelMarkPayloadI,
  PlayerMarksI,
  PlayerMarksSelectMarkPayloadI,
  PlayerMarksUpdateMarkPayloadI,
} from "_components/Player/types/marks";
import { ActionI } from "_types/core";

const playerMarksReducer: Reducer<
  PlayerMarksI,
  ActionI<PlayerMarksActionE, any | PlayerMarksAddMarkPayloadI>
> = (state = {}, actions) => {
  const { type, payload } = actions;

  switch (type) {
    case PlayerMarksActionE.ADD_MARK: {
      if (!payload) return state;
      console.log("add", payload);
      const { toolName, data } = payload as PlayerMarksAddMarkPayloadI;
      const nextMarkList = state[toolName] || [];

      nextMarkList.push(data);

      return Object.assign({}, state, {
        [toolName]: nextMarkList,
      });
    }
    case PlayerMarksActionE.DEL_MARK: {
      if (!payload) return state;
      const { toolName, id } = payload as PlayerMarksDelMarkPayloadI;
      const nextMarkList = (state[toolName] || []).filter((item) => item.data.uuid !== id);
      return Object.assign({}, state, {
        [toolName]: nextMarkList,
      });
    }
    case PlayerMarksActionE.UPDATE_MARK: {
      if (!payload) return state;
      const { toolName, nextMark } = payload as PlayerMarksUpdateMarkPayloadI;
      const currentMarks = state[toolName] || [];
      const targetMark = currentMarks.find((item) => item.data.uuid === nextMark.data.uuid);
      if (!targetMark) return state;
      const { data, examKey } = targetMark;
      return Object.assign({}, state, {
        [toolName]: state[toolName].filter((item) => {
          if (item.examKey === examKey) {
            if (data.uuid === nextMark.data.uuid) return nextMark;
            else return item;
          }
        }),
      });
    }
    case PlayerMarksActionE.ACTIVE_MARK: {
      if (!payload) return state;
      const { toolName, id } = payload as PlayerMarksSelectMarkPayloadI;
      const nextMarks = (state[toolName] || []).map((item) => {
        item.data.active = item.data.uuid === id;
        return item;
      });

      return Object.assign({}, state, {
        [toolName]: nextMarks,
      });
    }
    default:
      return state;
  }
};

export default playerMarksReducer;
