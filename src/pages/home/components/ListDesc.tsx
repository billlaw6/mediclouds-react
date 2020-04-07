import React, { ReactElement, FunctionComponent, useState } from "react";
import { ListDescPropsI } from "../type";
import { Icon, Input } from "antd";

const ListDesc: FunctionComponent<ListDescPropsI> = (props): ReactElement => {
  const { desc, updateDesc } = props;

  const [inputValue, changeInputValue] = useState(desc || "");
  const [showEditor, editDesc] = useState(false);

  return (
    <>
      <span className={`dicom-list-desc-text`}>{desc}</span>
      <Icon
        className={`dicom-list-desc-edit iconfont`}
        type="edit"
        onClick={(e): void => {
          e.stopPropagation();
          editDesc(true);
        }}
      />
      <Input
        className={`dicom-list-desc-editor ${showEditor ? "dicom-list-desc-show" : ""}`}
        value={inputValue || ""}
        placeholder="备注上限20个字"
        maxLength={20}
        onClick={(e): void => e.stopPropagation()}
        onInput={(e): void => changeInputValue(e.currentTarget.value)}
        addonAfter={
          <div className="dicom-list-desc-ctl">
            <Icon
              className="iconfont icon_ic-complete"
              type="check-circle"
              onClick={(e): void => {
                e.stopPropagation();
                updateDesc && updateDesc(inputValue);
                editDesc(false);
              }}
            />
            <Icon
              type="close-circle"
              className="iconfont icon_ic-close"
              onClick={(e): void => {
                e.stopPropagation();
                editDesc(false);
              }}
            />
          </div>
        }
      ></Input>
    </>
  );
};

export default ListDesc;
