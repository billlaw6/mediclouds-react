/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Icon, Radio, Input } from "antd";

import { FeedbackTypeI } from "_constants/interface";
import axios from "_services/api";

import "./Feedback.less";

const TOTAL = 200;

const Feedback: FunctionComponent = () => {
  const [feedbackTypes, setFeedbackTypes] = useState<FeedbackTypeI[]>([]); // 反馈类型
  const [currentType, setCurrentType] = useState<FeedbackTypeI>();
  const [value, setValue] = useState("");

  const onSubmit = (): void => {
    if (currentType) {
      axios
        .post("/user/feedback/", { type_id: currentType.code, content: value })
        .then((_res) => {
          setCurrentType(undefined);
          setValue("");
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    axios
      .get("/user/feedback-type/")
      .then((res) => {
        const types = (res.data as FeedbackTypeI[]).sort(
          (a, b) => parseInt(a.code, 10) - parseInt(b.code, 10),
        );
        setFeedbackTypes(types);
        setCurrentType(types[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="feedback">
      <div className="feedback-header">
        <h1>意见反馈</h1>
        <Link className="feedback-back" to="/">
          <Icon className="iconfont" type="arrow-left" />
          <span>返回</span>
        </Link>
      </div>
      <div className="feedback-content">
        <div className="feedback-detail">
          <div className="feedback-content-selector">
            <Radio.Group
              onChange={(e): void => {
                const currentType = feedbackTypes.find((item) => item.code === e.target.value);
                if (currentType) {
                  setCurrentType(currentType);
                }
              }}
            >
              {feedbackTypes
                .sort((a, b) => parseInt(a.code, 10) - parseInt(b.code, 10))
                .map((type) => {
                  return (
                    <Radio className="feedback-radio" key={type.code} value={type.code}>
                      {type.title}
                    </Radio>
                  );
                })}
            </Radio.Group>
          </div>
          <div className="feedback-content-title">
            <b>详细描述</b>
            <span>
              （欢迎提出您在使用过程中遇到的问题或宝贵意见，感谢您对医影的支持。200个汉字以内）
            </span>
          </div>
          <div className="feedback-content-textarea">
            <Input.TextArea
              className="feedback-content-textarea-input"
              value={value}
              rows={4}
              onInput={(val): void => setValue(val.currentTarget.value)}
              maxLength={TOTAL}
            ></Input.TextArea>
            <span className="feedback-content-textarea-count">
              {value.length}/{TOTAL}
            </span>
          </div>
        </div>
        <button className="feedback-submit" onClick={onSubmit}>
          提交
        </button>
      </div>
    </div>
  );
};

export default Feedback;
