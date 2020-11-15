import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  MenuOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import LinkButton from "_components/LinkButton/LinkButton";
import useResources from "_hooks/useResources";
import { ViewTypeEnum } from "_pages/resources/type";
import { ExamSortKeyE, ImgAndPdfSortKeyE, ReportSortKeyE, ResourcesTypeE } from "_types/resources";

import "./style.less";

interface ControllerPropsI {
  showDelBtn?: boolean; // 显示删除按钮
  isSelectable?: boolean; // 是否开启选择模式
  onClickDelBtn?: Function; // 当点击删除按钮时
  onClickCancelBtn?: Function; // 当点击后退按钮时
  onDel?: Function; // 触发删除动作
  onSortByChange?: (val: ExamSortKeyE | ImgAndPdfSortKeyE) => void; // 当排序规则改变时触发
  resourcesType: ResourcesTypeE; // 当前的资源类型
}

const Controller: FunctionComponent<ControllerPropsI> = (props) => {
  const {
    resourcesType,
    showDelBtn,
    isSelectable,
    onDel,
    onClickDelBtn,
    onClickCancelBtn,
    onSortByChange,
  } = props;

  const { viewMode, sortBy, changeViewMode } = useResources();

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
              disabled={sortBy[resourcesType] === ExamSortKeyE.STUDY_DATE}
              key={ExamSortKeyE.STUDY_DATE}
            >
              时间排序
            </Menu.Item>
            <Menu.Item
              disabled={sortBy[resourcesType] === ExamSortKeyE.MODALITY}
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
              disabled={sortBy[resourcesType] === ImgAndPdfSortKeyE.CREATED_AT}
              key={ImgAndPdfSortKeyE.CREATED_AT}
            >
              时间排序
            </Menu.Item>
            <Menu.Item
              disabled={sortBy[resourcesType] === ImgAndPdfSortKeyE.FILENAME}
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
              disabled={sortBy[resourcesType] === ImgAndPdfSortKeyE.CREATED_AT}
              key={ImgAndPdfSortKeyE.CREATED_AT}
            >
              时间排序
            </Menu.Item>
            <Menu.Item
              disabled={sortBy[resourcesType] === ImgAndPdfSortKeyE.FILENAME}
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

  const onChangeViewMode = (): void => {
    changeViewMode(viewMode === ViewTypeEnum.GRID ? ViewTypeEnum.LIST : ViewTypeEnum.GRID);
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
        {showDelBtn ? (
          <div className={`resources-controller-del${isSelectable ? " active" : ""}`}>
            {isSelectable ? (
              <ArrowLeftOutlined
                className="iconfont"
                onClick={(): void => onClickCancelBtn && onClickCancelBtn()}
              ></ArrowLeftOutlined>
            ) : (
              <DeleteOutlined
                className="iconfont"
                onClick={(): void => onClickDelBtn && onClickDelBtn()}
              ></DeleteOutlined>
            )}
            <span onClick={(): void => onDel && onDel()}>删除</span>
          </div>
        ) : null}
      </div>
      <div className={`resources-controller-item${showDelBtn ? "" : " hidden"}`}>
        {resourcesType === ResourcesTypeE.LUNG_NODULES_REPORT ? null : (
          <Dropdown overlay={sortContent()} placement="bottomRight">
            <SortAscendingOutlined className="resources-controller-select-sort iconfont"></SortAscendingOutlined>
          </Dropdown>
        )}
        {/* {resourcesType === ResourcesTypeE.EXAM ? (
          viewMode === ViewTypeEnum.GRID ? (
            <MenuOutlined
              className="resources-controller-select-view iconfont"
              onClick={onChangeViewMode}
            ></MenuOutlined>
          ) : (
            <AppstoreOutlined
              className="resources-controller-select-view iconfont"
              onClick={onChangeViewMode}
            ></AppstoreOutlined>
          )
        ) : null} */}
      </div>
    </div>
  );
};

export default Controller;
