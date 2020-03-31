import React, { ReactElement } from "react";
import { Table, Icon, Button, Form, Input, Comment, Avatar, List } from "antd";
import moment, { Moment } from "moment";
import { FeedbackI, FeedbackReplyI, FeedbackTypeI } from "_constants/interface";
import { getFeedbackType, getFeedback, createFeedback } from "_services/user";
import { TableEventListeners } from "antd/lib/table";
import { FeedbackPropsI, FeedbackStateI } from "./type";
import "./Feedback.less";

const dateFormat = "YYYY-MM-DD HH:mm:ss";

class Feedback extends React.Component<FeedbackPropsI, FeedbackStateI> {
  constructor(props: FeedbackPropsI) {
    super(props);
    this.state = {
      feedbackTypeList: [],
      feedbackList: [],
    };
  }

  fetchFeedbackType = (): void => {
    getFeedbackType()
      .then((res: any) => {
        console.log(res);
        this.setState({ feedbackTypeList: res.data });
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  fetchFeedback = (): void => {
    const params = {
      start: "2020-03-20",
      end: "2020-04-01",
    };
    getFeedback(params)
      .then((res: any) => {
        console.log(res);
        this.setState({ feedbackList: res.data });
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  componentDidMount(): void {
    this.fetchFeedback();
  }

  // getTableRowKey = (record: UserI): string => {
  //     return record.id.toString();
  // }

  render(): ReactElement {
    const { user } = this.props;
    const { feedbackList } = this.state;

    return (
      <div className="feedback">
        <div className="feedback-header">
          <h2>用户反馈</h2>
        </div>
        <div className="feedback-history">
          <List
            dataSource={feedbackList}
            header={`${feedbackList.length} ${feedbackList.length > 1 ? "replies" : "reply"}`}
            itemLayout="horizontal"
            renderItem={props => <Comment {...props} />}
          />
          {feedbackList.map((item: FeedbackI) => {
            return <div>item.title</div>;
          })}
        </div>
        <div className="feedback-input">
          <Form layout="inline">
            <Form.Item label="内容">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default Feedback;
