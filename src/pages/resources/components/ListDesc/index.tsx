import React, { ReactElement, FunctionComponent, useState } from "react";
import { ListDescPropsI } from "../../type";
import { Input } from "antd";
import { EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

import "./style.less";

const ListDesc: FunctionComponent<ListDescPropsI> = (props): ReactElement => {
  const { desc, updateDesc } = props;

  const [inputValue, changeInputValue] = useState(desc || "");
  const [showEditor, editDesc] = useState(false);

  return (
    <>
      <span className={`exam-table-desc-text`}>{desc}</span>
      <EditOutlined
        className={`exam-table-desc-edit iconfont`}
        onClick={(e): void => {
          e.stopPropagation();
          editDesc(true);
        }}
      ></EditOutlined>
      {/* <Icon
        className={`exam-table-desc-edit iconfont`}
        type="edit"
        onClick={(e): void => {
          e.stopPropagation();
          editDesc(true);
        }}
      /> */}
      <Input
        className={`exam-table-desc-editor ${showEditor ? "exam-table-desc-show" : ""}`}
        value={inputValue || ""}
        placeholder="备注上限20个字"
        maxLength={20}
        onClick={(e): void => e.stopPropagation()}
        onInput={(e): void => changeInputValue(e.currentTarget.value)}
        addonAfter={
          <div className="exam-table-desc-ctl">
            <CheckCircleOutlined
              className="iconfont icon_ic-complete"
              onClick={(e): void => {
                e.stopPropagation();
                updateDesc && updateDesc(inputValue);
                editDesc(false);
              }}
            ></CheckCircleOutlined>
            <CloseCircleOutlined
              className="iconfont icon_ic-close"
              onClick={(e): void => {
                e.stopPropagation();
                editDesc(false);
              }}
            ></CloseCircleOutlined>
          </div>
        }
      ></Input>
    </>
  );
};

export default ListDesc;
