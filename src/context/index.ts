// context/index.ts
// 使用新版hooks的两个api联用提供redux之外的组件间数据共享方式。
export const defaultState = {
  value: 0,
};

export function reducer(state: any, action: any) {
  switch (action.type) {
    case "ADD_NUM":
      return { ...state, value: state.value + 1 };
    case "REDUCE_NUM":
      return { ...state, value: state.value - 1 };
    default:
      return { ...state };
  }
}
