import { ICanvasState } from '../constants/store.d';

export const EDIT_CANVAS_ACTION_TYPE = 'canvas/edit';
export const changeCanvasAction = (payload: ICanvasState) => ({
    type: EDIT_CANVAS_ACTION_TYPE,
    payload: payload,
});