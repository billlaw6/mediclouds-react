import React, { FunctionComponent, useEffect, useState } from "react";
import { message, Modal, Spin, Tabs } from "antd";

import useResources from "_hooks/useResources";
import { ExamIndexI, ImgI, PdfI, ResourcesTypeE } from "_types/resources";
import Controller from "./components/Controller";
import { GetSearchQueryPropsI, SearchQueryResI } from "_types/api";

import { flattenArr } from "_helper";
import ExamCards from "_components/ExamCards";
import ImgCards from "_components/ImgCards";
import PdfTable from "_components/PdfTable";
import LungNodulesReportCards from "./components/LungNodulesReportCards";
import Notify from "_components/Notify";
import { checkDicomParseProgress } from "_api/dicom";
import PrivacyNotice from "_components/PrivacyNotice";

import "./style.less";
import { useHistory } from "react-router";
import CreateCase from "./components/CreateCase";
import { LungNoduleReportI } from "_types/ai";

interface SelectedI {
  [key: string]: any;
  exam: string[][];
  img: string[][];
  pdf: string[][];
  lung_nodules_report: string[][];
}

/* 资源当前的页码 */
interface SearchQueryI {
  exam: GetSearchQueryPropsI<"study_date" | "modality">;
  img: GetSearchQueryPropsI<"created_at" | "filename">;
  pdf: GetSearchQueryPropsI<"created_at" | "filename">;
  lung_nodules_report: GetSearchQueryPropsI<"study_date" | "modality">;
}

const { TabPane } = Tabs;

let timer: number | null = null;

const Resources: FunctionComponent = () => {
  const history = useHistory();
  const {
    fetchExamList,
    delExam,
    fetchImgList,
    delImg,
    fetchPdfList,
    delPdf,
    lungNodulesReportList,
    fetchLungNodulesReportList,
    delLungNodulesReport,
    examList,
    imgList,
    pdfList,
    resourcesSortBy,
    resourcesTabType,
    changeSortBy,
    switchTabType,
  } = useResources();

  const [selected, setSelected] = useState<SelectedI>({
    exam: [],
    img: [],
    pdf: [],
    lung_nodules_report: [],
  }); // 已选择的
  const [searchQuery, setSearchQuery] = useState<SearchQueryI>({
    exam: {
      current: 1,
      size: 12,
      sort: resourcesSortBy.exam,
    },
    img: {
      current: 1,
      size: 12,
      sort: resourcesSortBy.img,
    },
    pdf: {
      current: 1,
      size: 12,
      sort: resourcesSortBy.pdf,
    },
    lung_nodules_report: {
      current: 1,
      size: 12,
      sort: resourcesSortBy.lung_nodules_report,
    },
  });
  const [selectMode, setSelectMode] = useState(false); // 选择模式
  const [showNotify, setShowNotify] = useState(false); // 显示解析
  const [parsingInfo, setParingInfo] = useState<{
    error: number;
    parsing: number;
    total: number;
  } | null>(null); // 解析进度
  const [showCreateCase, setShowCreateCase] = useState(false);

  /** 获取已选的实例列表 */
  const getResourceInstances = (
    type: ResourcesTypeE,
  ): SearchQueryResI<ExamIndexI | ImgI | PdfI | LungNoduleReportI> | undefined => {
    const ids = flattenArr(selected[type]);
    let instance: SearchQueryResI<ExamIndexI | ImgI | PdfI | LungNoduleReportI> | undefined;

    switch (type) {
      case ResourcesTypeE.EXAM:
        instance = examList;
        break;
      case ResourcesTypeE.IMG:
        instance = imgList;
        break;
      case ResourcesTypeE.PDF:
        instance = pdfList;
        break;
      case ResourcesTypeE.LUNG_NODULES_REPORT:
        instance = lungNodulesReportList;
        break;
      default:
        break;
    }

    if (instance) {
      const res = instance.results.filter((item) => ids.indexOf(`${item.id}`) > -1);
      if (!res.length) return;
      return { count: res.length, results: res };
    }

    return;
  };

  /**
   * 更新所选tab页的已选id列表
   * @param type
   * @param vals
   */
  const updateSelected = (type: ResourcesTypeE, vals: string[]): void => {
    setSelected(Object.assign({}, selected, { [type]: vals }));
  };

  const fetchResources = (type: ResourcesTypeE): void => {
    switch (type) {
      case ResourcesTypeE.EXAM:
        fetchExamList(searchQuery[ResourcesTypeE.EXAM])
          .then(() => console.log("successed fetch examList"))
          .catch((err) => console.error(err));
        break;
      case ResourcesTypeE.IMG:
        fetchImgList(searchQuery[ResourcesTypeE.IMG])
          .then(() => console.log("successed fetch imgList"))
          .catch((err) => console.error(err));
        break;
      case ResourcesTypeE.PDF:
        fetchPdfList(searchQuery[ResourcesTypeE.PDF])
          .then(() => console.log("successed fetch pdfList"))
          .catch((err) => console.error(err));
        break;
      case ResourcesTypeE.LUNG_NODULES_REPORT:
        fetchLungNodulesReportList(searchQuery[ResourcesTypeE.LUNG_NODULES_REPORT])
          .then(() => console.log("successed fetch lung nodules report"))
          .catch((err) => console.error(err));
        break;
      default:
        break;
    }
  };

  /**
   *  获取当前tab页的资源
   * @param type
   */
  const getCurrentResources = (type: ResourcesTypeE) => {
    switch (type) {
      case ResourcesTypeE.EXAM:
        return examList;
      case ResourcesTypeE.IMG:
        return imgList;
      case ResourcesTypeE.PDF:
        return pdfList;
      case ResourcesTypeE.LUNG_NODULES_REPORT:
        return lungNodulesReportList;
      default:
        return;
    }
  };

  /**
   * 当前tab页的分页切换时触发
   * @param type
   * @param current
   */
  const onChangePagination = (type: ResourcesTypeE, current: number): void => {
    const nextData = Object.assign({}, searchQuery[type], { current });
    setSearchQuery(Object.assign({}, searchQuery, { [type]: nextData }));
    switchTabType(type);
  };

  /** 创建病例 */
  const onCreateCase = () => {
    const ids: any = {};

    for (const key of Object.keys(selected)) {
      const data = selected[key];
      const val = flattenArr(data);
      if (val.length) ids[key] = val;
    }

    if (!Object.keys(ids).length) return;

    setShowCreateCase(true);
  };

  /**
   * 确认删除
   */
  const confirmDel = () => {
    const ids = flattenArr(selected[resourcesTabType]);

    if (!ids || !ids.length) return;

    let delFunction: Function | undefined = undefined,
      typeName = "";

    switch (resourcesTabType) {
      case ResourcesTypeE.EXAM:
        delFunction = delExam;
        typeName = "检查";
        break;
      case ResourcesTypeE.IMG:
        delFunction = delImg;
        typeName = "图片";
        break;
      case ResourcesTypeE.PDF:
        delFunction = delPdf;
        typeName = "PDF";
        break;
      case ResourcesTypeE.LUNG_NODULES_REPORT:
        delFunction = delLungNodulesReport;
        typeName = "肺结节AI筛查报告";
        break;
      default:
        break;
    }

    Modal.confirm({
      centered: true,
      className: "del-confirm",
      title: "确认删除",
      content: `确认删除所选【${typeName}】吗？${
        resourcesTabType === ResourcesTypeE.EXAM
          ? "已选检查如有做过AI分析，则相关联的AI分析报告将一并删除"
          : ""
      }`,
      cancelText: "取消",
      okText: "确定",
      onOk: async (): Promise<void> => {
        try {
          if (delFunction) {
            await delFunction(ids);
            fetchResources(resourcesTabType);
            updateSelected(resourcesTabType, []);
          }

          setSelectMode(false);
        } catch (error) {
          throw new Error(error);
        }
      },
      onCancel: (): void => {
        // updateSelected(tabType, []);
        // setSelectMode(false);
      },
    });
  };

  useEffect(() => {
    timer = window.setInterval(() => {
      checkDicomParseProgress()
        .then((res) => {
          setParingInfo(res);
          if (res.parsing <= 0) {
            timer && window.clearInterval(timer);
            timer = null;
          } else {
            if (!showNotify) setShowNotify(true);
          }
        })
        .catch((err) => console.error(err));
    }, 5000);
  }, []);

  useEffect(() => {
    // 根据tab页签拉取相应的资源
    fetchResources(resourcesTabType);
  }, [resourcesTabType, searchQuery, parsingInfo]);

  const currentResources = getCurrentResources(resourcesTabType);
  const showSelectBtn = currentResources ? !!currentResources.results.length : false;
  let isPending = false;

  switch (resourcesTabType) {
    case ResourcesTypeE.EXAM:
      isPending = !examList;
      break;
    case ResourcesTypeE.IMG:
      isPending = !imgList;
      break;
    case ResourcesTypeE.PDF:
      isPending = !pdfList;
      break;
    case ResourcesTypeE.LUNG_NODULES_REPORT:
      isPending = !lungNodulesReportList;
      break;
    default:
      break;
  }

  return (
    <section className="resources">
      {showNotify ? (
        <Notify
          mode={parsingInfo && parsingInfo.parsing ? "parsing" : "successed"}
          onClose={(): void => setShowNotify(false)}
        >
          {parsingInfo && parsingInfo.parsing
            ? `您上传的DICOM文件仍有${parsingInfo.parsing}个正在解析，展示的不是全部影像，请耐心等待。`
            : "DICOM文件已经全部解析成功"}
        </Notify>
      ) : null}
      <Controller
        resourcesType={resourcesTabType}
        showSelectBtn={showSelectBtn}
        isSelectable={selectMode}
        onDel={confirmDel}
        onCreateCase={onCreateCase}
        onSelectBtn={(): void => setSelectMode(true)}
        onClickCancelBtn={(): void => {
          setSelectMode(false);
          setSelected({
            [ResourcesTypeE.EXAM]: [],
            [ResourcesTypeE.IMG]: [],
            [ResourcesTypeE.PDF]: [],
            [ResourcesTypeE.LUNG_NODULES_REPORT]: [],
          });
        }}
        onSortByChange={(val): void => {
          changeSortBy(resourcesTabType, val);
          setSearchQuery(
            Object.assign({}, searchQuery, {
              [resourcesTabType]: {
                ...searchQuery[resourcesTabType],
                sort: val,
              },
            }),
          );
        }}
      ></Controller>
      <Spin spinning={isPending} tip="加载资源...">
        <Tabs
          className="resources-tabs"
          type="card"
          activeKey={resourcesTabType}
          onChange={(val): void => switchTabType(val as ResourcesTypeE)}
        >
          <TabPane className="resources-tabs-item" tab="检查" key={ResourcesTypeE.EXAM}>
            <ExamCards
              data={examList}
              isSelectable={selectMode}
              searchQuery={searchQuery[ResourcesTypeE.EXAM]}
              onChangePagination={(current): void => {
                onChangePagination(ResourcesTypeE.EXAM, current);
              }}
              selected={flattenArr(selected[ResourcesTypeE.EXAM])}
              onSelected={(vals): void => updateSelected(ResourcesTypeE.EXAM, vals)}
              onUpdateDescSuccess={(): void => fetchResources(resourcesTabType)}
            ></ExamCards>
          </TabPane>
          <TabPane className="resources-tabs-item" tab="图片" key={ResourcesTypeE.IMG}>
            <ImgCards
              data={imgList}
              isSelectable={selectMode}
              selected={flattenArr(selected[ResourcesTypeE.IMG])}
              searchQuery={searchQuery[ResourcesTypeE.IMG]}
              onSelected={(vals): void => updateSelected(ResourcesTypeE.IMG, vals)}
              onChangePagination={(current): void => {
                onChangePagination(ResourcesTypeE.IMG, current);
              }}
            ></ImgCards>
          </TabPane>
          <TabPane className="resources-tabs-item" tab="PDF" key={ResourcesTypeE.PDF}>
            <PdfTable
              data={pdfList}
              isSelectable={selectMode}
              selected={flattenArr(selected[ResourcesTypeE.PDF])}
              searchQuery={searchQuery[ResourcesTypeE.PDF]}
              onSelected={(vals): void => updateSelected(ResourcesTypeE.PDF, vals)}
              onChangePagination={(current): void => {
                onChangePagination(ResourcesTypeE.PDF, current);
              }}
            ></PdfTable>
          </TabPane>
          <TabPane
            className="resources-tabs-item"
            tab="肺结节AI筛查报告"
            key={ResourcesTypeE.LUNG_NODULES_REPORT}
          >
            <LungNodulesReportCards
              data={lungNodulesReportList}
              searchQuery={searchQuery[ResourcesTypeE.PDF]}
              onSelected={(vals): void => updateSelected(ResourcesTypeE.LUNG_NODULES_REPORT, vals)}
              selected={flattenArr(selected[ResourcesTypeE.LUNG_NODULES_REPORT])}
              isSelectable={selectMode}
              onChangePagination={(current): void => {
                onChangePagination(ResourcesTypeE.LUNG_NODULES_REPORT, current);
              }}
            ></LungNodulesReportCards>
          </TabPane>
        </Tabs>
      </Spin>
      <PrivacyNotice></PrivacyNotice>
      <CreateCase
        show={showCreateCase}
        exam={getResourceInstances(ResourcesTypeE.EXAM) as SearchQueryResI<ExamIndexI>}
        pdf={getResourceInstances(ResourcesTypeE.PDF) as SearchQueryResI<PdfI>}
        img={getResourceInstances(ResourcesTypeE.IMG) as SearchQueryResI<ImgI>}
        lung_nodules_report={
          getResourceInstances(
            ResourcesTypeE.LUNG_NODULES_REPORT,
          ) as SearchQueryResI<LungNoduleReportI>
        }
        onCreateCase={(): void => {
          setShowCreateCase(false);
          updateSelected(resourcesTabType, []);
          setSelectMode(false);
        }}
        onCancel={(): void => {
          setShowCreateCase(false);
          updateSelected(resourcesTabType, []);
          setSelectMode(false);
        }}
      ></CreateCase>
    </section>
  );
};

export default Resources;
