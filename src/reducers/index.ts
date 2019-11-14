import { combineReducers } from 'redux';
import { History } from 'history';
import { connectRouter } from 'connected-react-router';
import userReducer from './user';
import draftReducer from './draft';
import canvasReducer from './canvas';
import counterReducer from './counter';
import tokenReducer from './token';

// 每个reducer必须都返回state类型的数据！
const createRootReducer = (history: History) =>
    combineReducers({
        router: connectRouter(history),
        user: userReducer,
        count: counterReducer,
        draft: draftReducer,
        canvas: canvasReducer,
        token: tokenReducer,
    });

// IState不能作为组件创建时props类型！！！必须用store.d里定义的！三天的教训！
// export type IState = ReturnType<typeof createRootReducer>

export default createRootReducer;
