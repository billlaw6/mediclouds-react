import React, { FunctionComponent, useEffect, useState } from "react";
import { Modal, Tabs } from "antd";

import useResources from "_hooks/useResources";
import { ResourcesTypeE } from "_types/resources";
import Controller from "./components/Controller";
import { GetSearchQueryPropsI } from "_types/api";

import { ViewTypeEnum } from "./type";
import ExamTable from "./components/ExamTable";
import ExamCards from "./components/ExamCards";
import { flattenArr } from "_helper";
import ImgCards from "./components/ImgCards";
import PdfTable from "./components/PdfTable";
import Notify from "_components/Notify";
import { checkDicomParseProgress } from "_api/dicom";
import PrivacyNotice from "_components/PrivacyNotice";
import useAccount from "_hooks/useAccount";
import Empty from "./components/Empty";

import "./style.less";

interface SelectedI {
  exam: string[][];
  img: string[][];
  pdf: string[][];
  report: string[][];
}

/* 资源当前的页码 */
interface SearchQueryI {
  exam: GetSearchQueryPropsI<"study_date" | "modality">;
  img: GetSearchQueryPropsI<"created_at" | "filename">;
  pdf: GetSearchQueryPropsI<"created_at" | "filename">;
  report: GetSearchQueryPropsI<"study_date" | "modality">;
}

const { TabPane } = Tabs;

let timer: number | null = null;

const Resources: FunctionComponent = () => {
  const {
    fetchExamList,
    delExam,
    fetchImgList,
    delImg,
    fetchPdfList,
    delPdf,
    examList,
    imgList,
    pdfList,
    sortBy,
    viewMode,
    changeSortBy,
  } = useResources();
  const { account } = useAccount();

  const [tabType, setTabType] = useState(ResourcesTypeE.EXAM); // 当前tab页类型
  const [selected, setSelected] = useState<SelectedI>({ exam: [], img: [], pdf: [], report: [] }); // 已选择的
  const [searchQuery, setSearchQuery] = useState<SearchQueryI>({
    exam: {
      current: 1,
      size: 12,
      sort: sortBy.exam,
    },
    img: {
      current: 1,
      size: 12,
      sort: sortBy.img,
    },
    pdf: {
      current: 1,
      size: 12,
      sort: sortBy.pdf,
    },
    report: {
      current: 1,
      size: 12,
      sort: sortBy.report,
    },
  });
  const [selectMode, setSelectMode] = useState(false); // 选择模式
  const [showNotify, setShowNotify] = useState(false); // 显示解析
  const [parsingInfo, setParingInfo] = useState<{
    error: number;
    parsing: number;
    total: number;
  } | null>(null); // 解析进度

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
  };

  /**
   * 确认删除
   */
  const confirmDel = () => {
    const ids = flattenArr(selected[tabType]);

    if (!ids || !ids.length) return;

    let delFunction: Function | undefined = undefined,
      typeName = "";

    switch (tabType) {
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
      default:
        break;
    }

    Modal.confirm({
      centered: true,
      className: "del-confirm",
      title: "确认删除",
      content: `确认删除所选【${typeName}】吗？`,
      cancelText: "取消",
      okText: "确定",
      onOk: async (): Promise<void> => {
        try {
          if (delFunction) {
            await delFunction(ids);
            fetchResources(tabType);
            updateSelected(tabType, []);
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
    fetchResources(tabType);
  }, [tabType, searchQuery, parsingInfo]);

  const currentResources = getCurrentResources(tabType);
  const showDelBtn = currentResources ? !!currentResources.results.length : false;

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
        resourcesType={tabType}
        showDelBtn={showDelBtn}
        isSelectable={selectMode}
        onDel={confirmDel}
        onClickDelBtn={(): void => setSelectMode(true)}
        onClickCancelBtn={(): void => {
          setSelectMode(false);
          setSelected({ exam: [], img: [], pdf: [], report: [] });
        }}
        onSortByChange={(val): void => {
          changeSortBy(tabType, val);
          setSearchQuery(
            Object.assign({}, searchQuery, {
              [tabType]: {
                ...searchQuery[tabType],
                sort: val,
              },
            }),
          );
        }}
      ></Controller>
      <Tabs
        type="card"
        activeKey={tabType}
        onChange={(val): void => setTabType(val as ResourcesTypeE)}
      >
        <TabPane tab="检查" key={ResourcesTypeE.EXAM}>
          {!examList ? (
            viewMode === ViewTypeEnum.LIST ? (
              <ExamTable
                data={examList}
                isSelectable={selectMode}
                searchQuery={searchQuery[ResourcesTypeE.EXAM]}
                onChangePagination={(current): void => {
                  onChangePagination(ResourcesTypeE.EXAM, current);
                }}
                selected={flattenArr(selected[ResourcesTypeE.EXAM])}
                onSelected={(vals): void => updateSelected(ResourcesTypeE.EXAM, vals)}
                onUpdateDescSuccess={(): void => {
                  fetchResources(tabType);
                }}
              ></ExamTable>
            ) : (
              <ExamCards
                data={examList}
                isSelectable={selectMode}
                searchQuery={searchQuery[ResourcesTypeE.EXAM]}
                onChangePagination={(current): void => {
                  onChangePagination(ResourcesTypeE.EXAM, current);
                }}
                selected={flattenArr(selected[ResourcesTypeE.EXAM])}
                onSelected={(vals): void => updateSelected(ResourcesTypeE.EXAM, vals)}
                onUpdateDescSuccess={(): void => fetchResources(tabType)}
              ></ExamCards>
            )
          ) : (
            <Empty />
          )}
        </TabPane>
        <TabPane tab="图片" key={ResourcesTypeE.IMG}>
          <ImgCards
            data={imgList}
            isSelectable={selectMode}
            selected={flattenArr(selected[ResourcesTypeE.IMG])}
            searchQuery={searchQuery[ResourcesTypeE.IMG]}
            onSelected={(vals): void => updateSelected(ResourcesTypeE.IMG, vals)}
          ></ImgCards>
        </TabPane>
        <TabPane tab="PDF" key={ResourcesTypeE.PDF}>
          <PdfTable
            data={pdfList}
            isSelectable={selectMode}
            selected={flattenArr(selected[ResourcesTypeE.PDF])}
            searchQuery={searchQuery[ResourcesTypeE.PDF]}
            onSelected={(vals): void => updateSelected(ResourcesTypeE.PDF, vals)}
          ></PdfTable>
        </TabPane>
      </Tabs>

      <PrivacyNotice></PrivacyNotice>
    </section>
  );
};

export default Resources;
