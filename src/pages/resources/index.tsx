/* eslint-disable @typescript-eslint/camelcase */
import React, { ReactElement, Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Dropdown, Menu, Pagination, Table, Checkbox, Modal, Spin } from "antd";
import DicomCard from "_components/DicomCard/DicomCard";
import { ExamIndexI } from "_types/api";
import { StoreStateI } from "_types/core";

import {
  MapStateToPropsI,
  ResourcesPropsI,
  ResourcesStateI,
  ViewTypeEnum,
  SortTypeEnum,
  MapDispatchToPropsI,
  TableDataI,
} from "./type";
import { deleteExamIndexListAction, SetViewSortByAction, setViewModeAction } from "_actions/dicom";

import { Gutter } from "antd/lib/grid/row";
import { ColumnProps, TablePaginationConfig } from "antd/lib/table";
import LinkButton from "_components/LinkButton/LinkButton";
import ListDesc from "./components/ListDesc";
import PrivacyNotice from "_components/PrivacyNotice";

import { isNull } from "_helper";
import Notify from "_components/Notify";
import { personalReq } from "_axios";
import { checkDicomParseProgress, getExamIndex } from "_api/dicom";
import Empty from "./components/Empty/Empty";
import {
  CloudUploadOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  SortAscendingOutlined,
  MenuOutlined,
  AppstoreOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { getExamList } from "_actions/resources";

import "./resources.less";
import { getImgList, getPdfList } from "_api/resources";
import ExamTable from "./components/ExamTable";

const DEFAULT_PAGE_SIZE = 12;

class Resources extends Component<ResourcesPropsI, ResourcesStateI> {
  pollTimer: number | null;

  constructor(props: ResourcesPropsI) {
    super(props);

    this.state = {
      viewType: ViewTypeEnum.GRID,
      sortType: SortTypeEnum.TIME,
      isSelectable: false,
      page: 1,
      selections: [],
      redirectUpload: false,
      parsing: 0,
      showNotify: false,
      poll: false,
      pageSize: DEFAULT_PAGE_SIZE,
      pdfList: [],
      imgList: [],
    };

    this.pollTimer = null;
  }

  componentDidMount(): void {
    checkDicomParseProgress()
      .then((res) => this.setState({ parsing: res, showNotify: !!res, poll: !!res }))
      .catch((err) => console.error(err));

    this.fetchExamList();

    // this.fetchImgList();
    // this.fetchPdfList();
  }

  componentDidUpdate(): void {
    if (this.state.poll && isNull(this.pollTimer)) {
      this.poll();
    }
  }

  fetchExamList = (): void => {
    const { getList } = this.props;

    getExamIndex()
      .then((res) => getList && getList(res))
      .catch((err) => console.error(err));
  };

  fetchImgList = (): void => {
    const { user } = this.props;

    getImgList(user.id)
      .then((res) => console.log("img list", res))
      .catch((err) => console.error(err));
  };

  fetchPdfList = (): void => {
    const { user } = this.props;

    getPdfList(user.id)
      .then((res) => console.log("pdf list ", res))
      .catch((err) => console.error(err));
  };

  poll = (): void => {
    this.pollTimer = window.setInterval(() => {
      checkDicomParseProgress()
        .then((res) => {
          this.setState({ parsing: res, poll: !!res });
          if (res <= 0) {
            this.fetchExamList();
            this.pollTimer && window.clearInterval(this.pollTimer);
            this.pollTimer = null;
          }
        })
        .catch((err) => console.error(err));
    }, 5000);
  };

  list = (): ReactElement | undefined => {
    const { selections, isSelectable, page, pageSize } = this.state;
    const columns: ColumnProps<TableDataI>[] = [
      {
        title: "类型",
        dataIndex: "modality",
        render: (text: string, record): ReactElement | string => {
          const { id } = record;
          return isSelectable ? (
            <>
              <Checkbox value={id} checked={selections.indexOf(id) > -1}></Checkbox>
              <span>{text}</span>
            </>
          ) : (
            text
          );
        },
      },
      { title: "姓名", dataIndex: "patient_name" },
      { title: "上传日期", dataIndex: "study_date" },
      { title: "备注", dataIndex: "desc", className: "dicom-list-desc" },
    ];

    const dataSource: TableDataI[] = [];
    const renderList = this.getCurrentItem();

    renderList.forEach((data) => {
      const { desc, ...others } = data;
      const editorDesc = (
        <ListDesc
          desc={desc}
          updateDesc={(value: string): void => this.updateDesc(others.id, value)}
        ></ListDesc>
      );
      dataSource.push({ ...others, desc: editorDesc });
    });

    const paginationConfig: TablePaginationConfig = {
      current: page,
      defaultPageSize: pageSize,
      total: renderList.length,
      hideOnSinglePage: true,
      onChange: (page: number): void => {
        this.setState({ page });
      },
    };

    return (
      <Table
        className="dicom-list dicom-list-table"
        rowKey={"id"}
        columns={columns}
        dataSource={dataSource}
        pagination={paginationConfig}
        onRow={(record) => {
          return {
            onClick: (): void => {
              this.onClickItem(record.id);
            },
          };
        }}
      ></Table>
    );
  };

  dicoms = (): ReactElement | undefined => {
    const { examIndexList } = this.props;
    const { page, isSelectable, selections, pageSize } = this.state;
    const renderList = this.getCurrentItem();

    if (renderList && renderList.length) {
      const rows: ReactElement[] = [];
      let cols: ReactElement[] = [];
      const gutter: [Gutter, Gutter] = [
        { xs: 8, sm: 16, md: 24 },
        { xs: 20, sm: 30, md: 40 },
      ];

      let count = 0;

      renderList.forEach((item) => {
        const { id, patient_name, study_date, desc, thumbnail, modality } = item;
        if (count >= 4) {
          count = 0;
          rows.push(
            <Row key={rows.length} gutter={gutter} align="middle">
              {cols}
            </Row>,
          );
          cols = [];
        }

        cols.push(
          <Col key={id} xs={24} md={12} lg={8} xl={6}>
            <DicomCard
              id={id}
              patientName={patient_name}
              studyDate={study_date}
              desc={desc}
              thumbnail={thumbnail}
              modality={modality}
              checkbox={isSelectable}
              checked={selections.indexOf(id) > -1}
              onClick={(): void => this.onClickItem(id)}
              updateDesc={(value: string): void => this.updateDesc(id, value)}
            ></DicomCard>
          </Col>,
        );
      });

      rows.push(
        <Row key={rows.length} gutter={gutter} align="top">
          {cols}
        </Row>,
      );

      return (
        <div className="dicom-list dicom-list-square">
          {rows}
          <Pagination
            hideOnSinglePage={true}
            current={page}
            pageSize={pageSize}
            total={examIndexList ? examIndexList.length : 0}
            onShowSizeChange={(_current, size): void => {
              // console.log("current, size", current, size);
              this.setState({ pageSize: size });
            }}
            onChange={(page): void => {
              this.setState({ page });
            }}
          ></Pagination>
        </div>
      );
    }
  };

  /**
   * 点击某个dicom 切换到播放器
   *
   * @memberof Resources
   */
  onClickItem = (id: string): void => {
    const { history, examIndexList = [] } = this.props;
    const { isSelectable, selections } = this.state;

    if (isSelectable) {
      const nextSelections = selections.filter((item) => item !== id);
      if (nextSelections.length === selections.length) {
        nextSelections.push(id);
      }
      this.setState({ selections: nextSelections });
    } else {
      const currentExam = examIndexList.find((item) => item.id === id);
      if (currentExam) {
        const { id } = currentExam;
        history.push("/player", {
          id,
        });
      }
    }
  };

  getCurrentItem = (): ExamIndexI[] => {
    const { examIndexList = [], dicomSettings } = this.props;
    const { page, pageSize } = this.state;
    const resList = this.sortList(examIndexList);

    if (dicomSettings.viewMode === ViewTypeEnum.GRID)
      return resList.slice((page - 1) * pageSize, page * pageSize);
    return resList;
  };

  controller = (): ReactElement => {
    const { examIndexList = [], dicomSettings } = this.props;
    const { isSelectable } = this.state;
    return (
      <div id="controller" className={`controller`}>
        <div className="controller-left">
          <span className="controller-title">检查资料</span>
          <LinkButton className="controller-upload" to="/upload" icon={<CloudUploadOutlined />}>
            上传
          </LinkButton>
          {examIndexList.length ? (
            <div className={`controller-del ${isSelectable ? "controller-del-open" : ""}`}>
              {isSelectable ? (
                <ArrowLeftOutlined
                  className="iconfont"
                  onClick={(): void =>
                    this.setState({ isSelectable: !isSelectable, selections: [] })
                  }
                ></ArrowLeftOutlined>
              ) : (
                <DeleteOutlined
                  className="iconfont"
                  onClick={(): void =>
                    this.setState({ isSelectable: !isSelectable, selections: [] })
                  }
                ></DeleteOutlined>
              )}
              {/* <Icon
                className="iconfont"
                type={isSelectable ? "arrow-left" : "delete"}
                onClick={(): void => this.setState({ isSelectable: !isSelectable, selections: [] })}
              /> */}
              {/* <span onClick={this.selectedAll}>全选</span> */}
              <span onClick={this.showConfirm}>删除</span>
            </div>
          ) : null}
        </div>
        <div className={`controller-right ${examIndexList.length ? "" : "hidden"}`}>
          <Dropdown overlay={this.dropdownContent()} placement="bottomRight">
            <SortAscendingOutlined className="controller-select-sort iconfont"></SortAscendingOutlined>
            {/* <Icon className="controller-select-sort iconfont" type="sort-ascending" /> */}
          </Dropdown>
          {dicomSettings.viewMode === ViewTypeEnum.GRID ? (
            <MenuOutlined
              className="controller-select-view iconfont"
              onClick={this.changeViewType}
            ></MenuOutlined>
          ) : (
            <AppstoreOutlined
              className="controller-select-view iconfont"
              onClick={this.changeViewType}
            ></AppstoreOutlined>
          )}
          {/* <Icon
            className="controller-select-view iconfont"
            type={dicomSettings.viewMode === ViewTypeEnum.GRID ? "menu" : "appstore"}
            onClick={this.changeViewType}
          /> */}
        </div>
      </div>
    );
  };

  selectedAll = (): void => {
    const currentItems = this.getCurrentItem();
    this.setState({
      selections:
        currentItems.length === this.state.selections.length
          ? []
          : currentItems.map((item) => item.id),
    });
  };

  changeViewType = (): void => {
    const { dicomSettings, setViewMode } = this.props;

    const nextType =
      dicomSettings.viewMode === ViewTypeEnum.GRID ? ViewTypeEnum.LIST : ViewTypeEnum.GRID;
    setViewMode(nextType);
  };

  showConfirm = (): void => {
    if (!this.state.selections.length) return;

    Modal.confirm({
      centered: true,
      className: "del-confirm",
      title: "确认删除",
      content: "确认删除所选文件/文件夹吗？",
      cancelText: "取消",
      okText: "确定",
      onOk: async (): Promise<void> => {
        await this.delDicom();
        this.setState({
          isSelectable: false,
          selections: [],
        });
      },
      onCancel: (): void => {
        this.setState({
          isSelectable: false,
          selections: [],
        });
      },
    });
  };

  /**
   * 返回列表排序的内容部分
   *
   * @memberof Resources
   */
  dropdownContent = (): ReactElement => {
    const { dicomSettings, setSortBy } = this.props;
    const { sortBy } = dicomSettings;

    return (
      <Menu
        className="resources-dicom-sort"
        onClick={(data): void => {
          // this.setState({ sortType: data.key as SortTypeEnum });
          setSortBy(data.key as SortTypeEnum);
        }}
      >
        <Menu.Item disabled={sortBy === SortTypeEnum.TIME} key={SortTypeEnum.TIME}>
          时间排序
        </Menu.Item>
        <Menu.Item disabled={sortBy === SortTypeEnum.TYPE} key={SortTypeEnum.TYPE}>
          种类排序
        </Menu.Item>
      </Menu>
    );
  };

  /**
   * 当确认隐私后 如果没有影响列表 跳转到upload界面
   *
   * @memberof Resources
   */
  onChecked = (): void => {
    // const { examIndexList } = this.props;
    // if (!examIndexList.length) this.setState({ redirectUpload: true });
  };

  /* === APIS 与服务器交互数据的方法 START === */

  /**
   * 更新指定dicom的desc
   *
   * @param {string} id dicom id
   * @param {string} value 更新的desc
   *
   * @memberof Resources
   */
  updateDesc = (id: string, value: string): void => {
    personalReq({
      method: "POST",
      url: `/dicom/exam-index/${id}/`,
      data: { desc: value },
    })
      .then(() => {
        this.fetchExamList();
      })
      .catch((err) => console.error(err));
  };

  /**
   * 删除所选dicom
   *
   * @memberof Resources
   */
  delDicom = async (): Promise<void> => {
    const { selections } = this.state;
    const { delList } = this.props;
    delList(selections);
  };
  /* === APIS 与服务器交互数据的方法 END === */

  /**
   * 排序列表
   *
   * @memberof Resources
   */
  sortList = (list: ExamIndexI[]): ExamIndexI[] => {
    // const { sortType } = this.state;
    const { sortBy } = this.props.dicomSettings;
    const temp = [...list];

    return temp.sort((a, b) => {
      if (sortBy === SortTypeEnum.TIME) {
        const studyDateA = a.study_date;
        const studyDateB = b.study_date;
        return studyDateA < studyDateB ? 1 : -1;
      }
      if (sortBy === SortTypeEnum.TYPE) {
        const modalityA = a.modality;
        const modalityB = b.modality;
        return modalityA < modalityB ? -1 : 1;
      }

      return 0;
    });
  };

  render(): ReactElement {
    const { examIndexList, user, getList, dicomSettings } = this.props;
    const { redirectUpload, showNotify, parsing } = this.state;
    const { viewMode } = dicomSettings;

    // if (redirectUpload) return <Redirect to="/upload" />;
    // else
    return (
      <section className="resources">
        {showNotify ? (
          <Notify
            mode={parsing ? "parsing" : "successed"}
            // onChange={(parsing): void => {
            //   getList && getList({ dtRange: [new Date(), new Date()], keyword: "" });
            //   this.setState({ parsing });
            // }}
            onClose={(): void => this.setState({ showNotify: false })}
          >
            {parsing
              ? `您上传的DICOM文件仍有${parsing}个正在解析，展示的不是全部影像，请耐心等待。`
              : "DICOM文件已经全部解析成功"}
          </Notify>
        ) : null}
        {this.controller()}
        {examIndexList ? (
          examIndexList.length ? (
            viewMode === ViewTypeEnum.GRID ? (
              this.dicoms()
            ) : (
              this.list()
              // <ExamTable data={examIndexList}></ExamTable>
            )
          ) : (
            <Empty></Empty>
          )
        ) : (
          <Spin indicator={<LoadingOutlined />} style={{ marginTop: "30px" }}></Spin>
        )}
        <PrivacyNotice user={user} onChecked={this.onChecked}></PrivacyNotice>
      </section>
    );
  }
}

const mapStateToProps = (state: StoreStateI): MapStateToPropsI => ({
  examIndexList: state.resources.dicom,
  user: state.account,
  dicomSettings: state.dicomSettings,
});
const mapDispatchToProps: MapDispatchToPropsI = {
  getList: getExamList,
  delList: deleteExamIndexListAction,
  setSortBy: SetViewSortByAction,
  setViewMode: setViewModeAction,
};
export default connect(mapStateToProps, mapDispatchToProps)(Resources);
