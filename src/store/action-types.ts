// 只有全局变量才写在reducer里，需要修改全局变量的用API请求才通过saga发出，其它的直接在页面中
//
export const SET_USER = "set_user";
export const UPDATE_USER = "update_user";
export const LOGOUT_USER = "logout_user";
export const SET_TOKEN = "set_token";
//
export const GET_EXAM_INDEX_LIST = "get_exam_index_list";
export const SET_EXAM_INDEX_LIST = "set_exam_index_list";
export const DELETE_EXAM_INDEX_LIST = "delete_exam_index_list";

export const SET_VIEW_MODE = "set_view_mode";
export const SET_VIEW_SORY_BY = "set_view_sort_by";

///////////////////////////////////////
// // 单一用户信息，用于用户管理
// export const SET_USER_INFO = "set_user_info";
// // 用户列表，用于用户管理
// export const SET_USER_LIST = "set_user_list";
// 微信登录CODE
// export const SET_WECHAT_CODE = "set_wechat_code";
// 设置登录表单信息
// export const SET_LOGIN_FORM = "set_login_form";
// 登录表单信息
// export const SUBMIT_LOGIN_FORM = "submit_login_form";
// 当前用户信息
// export const GET_DICOM_SERIES = "get_dicom_series";
// export const SET_DICOM_SERIES = "set_dicom_series";
// export const GET_DICOM_SERIES_MPR = "get_dicom_series_mpr";
// export const SET_DICOM_SERIES_MPR = "set_dicom_series_mpr";
// export const GET_DICOM_PICTURES = "get_dicom_pictures";
// export const SET_DICOM_PICTURES = "set_dicom_pictures";
// export const GET_PRIVACY_NOTICE = "get_privacy_notice";
// export const SET_PRIVACY_NOTICE = "set_privacy_notice";
// export const AGREE_PRIVACY_NOTICE = "agree_privacy_notice";
