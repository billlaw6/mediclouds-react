import {
  ArrowLeftOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  SelectOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import { spawn } from "child_process";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import LinkButton from "_components/LinkButton/LinkButton";
import useResources from "_hooks/useResources";
import { ExamSortKeyE, ImgAndPdfSortKeyE, ResourcesTypeE } from "mc-api";

import "./style.less";

interface ControllerPropsI {
  showSelectBtn?: boolean; // 显示删除按钮
  isSelectable?: boolean; // 是否开启选择模式
  onSelectBtn?: Function; // 当点击删除按钮时
  onClickCancelBtn?: Function; // 当点击后退按钮时
  onDel?: Function; // 触发删除动作
  onCreateCase?: Function; // 触发创建病例动作
  onCreateSimpleCase?: Function; // 触发创建病例动作
  onSortByChange?: (val: ExamSortKeyE | ImgAndPdfSortKeyE) => void; // 当排序规则改变时触发
  resourcesType: ResourcesTypeE; // 当前的资源类型
}

const Controller: FunctionComponent<ControllerPropsI> = (props) => {
  const {
    resourcesType,
    showSelectBtn,
    isSelectable,
    onDel,
    onCreateCase,
    onCreateSimpleCase,
    onSelectBtn,
    onClickCancelBtn,
    onSortByChange,
  } = props;

  const { resourcesSortBy } = useResources();

  /**
   * 返回Exam排序的内容部分
   *
   * @memberof Resources
   */
  const sortContent = (): ReactElement => {
    let items: ReactNode = null;

    switch (resourcesType) {
      case ResourcesTypeE.EXAM: {
        items = (
          <>
            <Menu.Item
              disabled={resourcesSortBy[resourcesType] === ExamSortKeyE.STUDY_DATE}
              key={ExamSortKeyE.STUDY_DATE}
            >
              时间排序
            </Menu.Item>
            <Menu.Item
              disabled={resourcesSortBy[resourcesType] === ExamSortKeyE.MODALITY}
              key={ExamSortKeyE.MODALITY}
            >
              种类排序
            </Menu.Item>
          </>
        );
        break;
      }
      case ResourcesTypeE.IMG: {
        items = (
          <>
            <Menu.Item
              disabled={resourcesSortBy[resourcesType] === ImgAndPdfSortKeyE.CREATED_AT}
              key={ImgAndPdfSortKeyE.CREATED_AT}
            >
              时间排序
            </Menu.Item>
            <Menu.Item
              disabled={resourcesSortBy[resourcesType] === ImgAndPdfSortKeyE.FILENAME}
              key={ImgAndPdfSortKeyE.FILENAME}
            >
              文件名排序
            </Menu.Item>
          </>
        );
        break;
      }
      case ResourcesTypeE.PDF: {
        items = (
          <>
            <Menu.Item
              disabled={resourcesSortBy[resourcesType] === ImgAndPdfSortKeyE.CREATED_AT}
              key={ImgAndPdfSortKeyE.CREATED_AT}
            >
              时间排序
            </Menu.Item>
            <Menu.Item
              disabled={resourcesSortBy[resourcesType] === ImgAndPdfSortKeyE.FILENAME}
              key={ImgAndPdfSortKeyE.FILENAME}
            >
              文件名排序
            </Menu.Item>
          </>
        );
        break;
      }
    }

    return (
      <Menu
        className="resources-dicom-sort"
        onClick={(data): void => {
          onSortByChange && onSortByChange(data.key as ExamSortKeyE);
        }}
      >
        {items}
      </Menu>
    );
  };

  const selectBtns = (): ReactNode => {
    return (
      <div className={`resources-controller-select${isSelectable ? " active" : ""}`}>
        {isSelectable ? (
          <ArrowLeftOutlined
            className="iconfont"
            onClick={(): void => onClickCancelBtn && onClickCancelBtn()}
          ></ArrowLeftOutlined>
        ) : (
          <span onClick={(): void => onSelectBtn && onSelectBtn()}>
            <Space>
              <SelectOutlined />
              <span>选择资源</span>
            </Space>
          </span>
        )}
        <span onClick={(): void => onDel && onDel()}>删除</span>
        <span onClick={(): void => onCreateCase && onCreateCase()}>创建病例</span>
        <span onClick={(): void => onCreateSimpleCase && onCreateSimpleCase()}>一键分享</span>
      </div>
    );
  };

  return (
    <div className="resources-controller">
      <div className="resources-controller-item">
        <span className="resources-controller-title">检查资料</span>
        <LinkButton
          className="resources-controller-upload"
          to="/upload"
          icon={<CloudUploadOutlined />}
        >
          上传
        </LinkButton>
        {showSelectBtn ? selectBtns() : null}
      </div>
      <div className={`resources-controller-item${showSelectBtn ? "" : " hidden"}`}>
        {resourcesType === ResourcesTypeE.LUNG_NODULES_REPORT ? null : (
          <Dropdown overlay={sortContent()} placement="bottomRight">
            <SortAscendingOutlined className="resources-controller-select-sort iconfont"></SortAscendingOutlined>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default Controller;
