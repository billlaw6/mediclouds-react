import React, { ReactElement, FunctionComponent, useState } from "react";
import { Card, Input, Skeleton, Checkbox } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import holdimg from "_images/placeholder_270x262.png";
import "./DicomCard.less";
import { EditOutlined, CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

interface DicomCardPropsI {
  id: string;
  thumbnail?: string;
  patientName: string;
  studyDate: string;
  desc?: string;
  modality?: string;
  checkbox?: boolean;
  checked?: boolean;

  updateDesc?: Function;
  onClick?: Function;
}

const DicomCard: FunctionComponent<DicomCardPropsI & RouteComponentProps> = (
  props,
): ReactElement => {
  const {
    id,
    thumbnail,
    patientName,
    studyDate,
    modality = "未知",
    desc,
    updateDesc,
    checkbox,
    onClick,
  } = props;
  const [inputValue, changeInputValue] = useState(desc || "");
  const [showEditor, editDesc] = useState(false);
  const [loaded, switchLoading] = useState(true);

  return (
    <article className="dicom-card">
      {checkbox ? (
        <Checkbox
          className="dicom-card-checkbox"
          checked={props.checked}
          value={props.id}
          onClick={(): void => onClick && onClick(id)}
        ></Checkbox>
      ) : null}
      <Card
        style={{ padding: loaded ? 20 : 0 }}
        className="dicom-card-content"
        onClick={(): void => onClick && onClick(id)}
        cover={
          <div className="dicom-card-inner">
            <Skeleton loading={loaded} active></Skeleton>
            <img
              style={{ display: loaded ? "none" : "block" }}
              src={thumbnail || holdimg}
              onLoad={(): void => {
                switchLoading(false);
              }}
            ></img>
          </div>
        }
      >
        <div className="dicom-card-info">
          <span>{patientName}</span>
          <span>{studyDate}</span>
        </div>
        <div className="dicom-card-type">{modality}</div>
      </Card>
      <div className={`dicom-card-desc ${showEditor ? "dicom-card-desc-editing" : ""}`}>
        <div className="dicom-card-desc-text">
          <div>{desc || "备注"}</div>
          <EditOutlined
            className="dicom-card-desc-edit iconfont icon_ic-edit"
            onClick={(): void => editDesc(true)}
          />
        </div>
        <Input
          className="dicom-card-desc-editor"
          value={inputValue || ""}
          placeholder="备注上限20个字"
          onInput={(value): void => changeInputValue(value.currentTarget.value)}
          maxLength={20}
          addonAfter={
            <div className="dicom-card-desc-ctl">
              <CheckCircleOutlined
                className="iconfont icon_ic-complete"
                onClick={(): void => {
                  updateDesc && updateDesc(inputValue);
                  editDesc(false);
                }}
              ></CheckCircleOutlined>
              <CloseCircleOutlined
                className="iconfont icon_ic-close"
                onClick={(): void => editDesc(false)}
              ></CloseCircleOutlined>
            </div>
          }
        ></Input>
      </div>
    </article>
  );
};

export default withRouter(DicomCard);
