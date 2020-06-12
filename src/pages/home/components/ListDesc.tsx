import React, { ReactElement, FunctionComponent, useState } from "react";
import { ListDescPropsI } from "../type";
import { Input } from "antd";
import { EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const ListDesc: FunctionComponent<ListDescPropsI> = (props): ReactElement => {
  const { desc, updateDesc } = props;

  const [inputValue, changeInputValue] = useState(desc || "");
  const [showEditor, editDesc] = useState(false);

  return (
    <>
      <span className={`dicom-list-desc-text`}>{desc}</span>
      <EditOutlined
        className={`dicom-list-desc-edit iconfont`}
        onClick={(e): void => {
          e.stopPropagation();
          editDesc(true);
        }}
      ></EditOutlined>
      {/* <Icon
        className={`dicom-list-desc-edit iconfont`}
        type="edit"
        onClick={(e): void => {
          e.stopPropagation();
          editDesc(true);
        }}
      /> */}
      <Input
        className={`dicom-list-desc-editor ${showEditor ? "dicom-list-desc-show" : ""}`}
        value={inputValue || ""}
        placeholder="备注上限20个字"
        maxLength={20}
        onClick={(e): void => e.stopPropagation()}
        onInput={(e): void => changeInputValue(e.currentTarget.value)}
        addonAfter={
          <div className="dicom-list-desc-ctl">
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
