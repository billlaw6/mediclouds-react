import { UserI, FeedbackReplyI, FeedbackI, FeedbackTypeI } from "_constants/interface";
import { RouteComponentProps } from "react-router";

export interface MapStateToPropsI {
  user: UserI;
}

export type FeedbackPropsI = MapStateToPropsI & RouteComponentProps;
export interface FeedbackStateI {
  feedbackTypeList: FeedbackTypeI[];
  feedbackList: FeedbackI[];
}
