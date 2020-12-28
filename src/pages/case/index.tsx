import { Button, Descriptions, message, PageHeader, Spin, Tabs, Tooltip } from "antd";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { getAgeByBirthday, getSexName } from "_helper";
import useCase from "_hooks/useCase";
import ExamCards from "_components/ExamCards";
import ImgCards from "_components/ImgCards";
import PdfTable from "_components/PdfTable";
import LungNodulesReportCards from "_pages/resources/components/LungNodulesReportCards";
import { ShareAltOutlined } from "@ant-design/icons";
import ClipboardJS from "clipboard";
import {
  CaseI,
  ExamSortKeyE,
  ImgAndPdfSortKeyE,
  ReportSortKeyE,
  ResourcesTypeE,
  SearchQueryPropsI,
} from "mc-api";

import "./style.less";

/* 资源当前的页码 */
interface SearchQueryI {
  [key: string]: any;
  [ResourcesTypeE.EXAM]: SearchQueryPropsI<"study_date" | "modality">;
  [ResourcesTypeE.IMG]: SearchQueryPropsI<"created_at" | "filename">;
  [ResourcesTypeE.PDF]: SearchQueryPropsI<"created_at" | "filename">;
  [ResourcesTypeE.LUNG_NODULES_REPORT]: SearchQueryPropsI<"created_at">;
}

const Case: FunctionComponent = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { getCase, updateCaseStamp } = useCase();
  const [current, setCurrent] = useState<CaseI>();
  const [loading, setLoading] = useState(true); // 是否在加载
  const [tabKey, setTabKey] = useState<ResourcesTypeE>(ResourcesTypeE.EXAM);
  const [searchQuery, setSearchQuery] = useState<SearchQueryI>({
    [ResourcesTypeE.EXAM]: {
      current: 1,
      size: 12,
      sort: ExamSortKeyE.STUDY_DATE,
    },
    [ResourcesTypeE.IMG]: {
      current: 1,
      size: 12,
      sort: ImgAndPdfSortKeyE.CREATED_AT,
    },
    [ResourcesTypeE.PDF]: {
      current: 1,
      size: 12,
      sort: ImgAndPdfSortKeyE.CREATED_AT,
    },
    [ResourcesTypeE.LUNG_NODULES_REPORT]: {
      current: 1,
      size: 12,
      sort: ReportSortKeyE.CREATED_AT,
    },
  });
  const [showToolTip, setShowToolTip] = useState(false);

  const updateSearchQuery = (type: ResourcesTypeE, num: number): void => {
    const next = Object.assign({}, searchQuery[type], {
      current: num,
    });
    setSearchQuery(
      Object.assign({}, searchQuery, {
        [type]: next,
      }),
    );
  };

  useEffect(() => {
    if (id) {
      const clipboard = new ClipboardJS(".case-share-btn", {
        text: (): string => {
          return `请使用电脑浏览器打开\r\nhttps://mi.mediclouds.cn/case/${id}?s=1`;
        },
      });

      clipboard.on("success", (e) => {
        setShowToolTip(true);
      });

      getCase(id)
        .then((res) => {
          setCurrent(res);
        })
        .catch((err) => {
          console.error(err);
          message.error({
            content: "获取病例失败",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const preShare = () => {
    const caseStamp = Date.now();
    updateCaseStamp(caseStamp, id).then(
      (res) => console.log(res),
      (err) => console.error(err),
    );
  };

  return (
    <section className="case">
      <PageHeader
        className="case-header"
        title="病例"
        subTitle={`${current ? `${current.name || "NA"}的病例` : ""}`}
        onBack={(): void => history.push("/case")}
        extra={
          <Tooltip title="复制成功！" trigger="click" arrowPointAtCenter>
            <Button className="case-share-btn" icon={<ShareAltOutlined />} onClick={preShare}>
              分享病例
            </Button>
          </Tooltip>
        }
      ></PageHeader>
      <Spin tip="loading..." spinning={loading} delay={200}>
        {loading ? null : current ? (
          <div className="case-content">
            <Descriptions column={3} bordered>
              <Descriptions.Item label="姓名">{current.name}</Descriptions.Item>
              <Descriptions.Item label="性别">{getSexName(current.sex)}</Descriptions.Item>
              <Descriptions.Item label="年龄">
                {getAgeByBirthday(current.birthday)}
              </Descriptions.Item>
              <Descriptions.Item label="病例描述">{current.description}</Descriptions.Item>
            </Descriptions>

            <Tabs activeKey={tabKey} onChange={(val): void => setTabKey(val as ResourcesTypeE)}>
              <Tabs.TabPane key={ResourcesTypeE.EXAM} tab="检查">
                <ExamCards
                  data={{ count: current.exam_objs.length, results: current.exam_objs }}
                  searchQuery={searchQuery[tabKey]}
                  disabledDesc
                  disabledAi
                  disabledEmptyTip
                  onChangePagination={(num): void => updateSearchQuery(ResourcesTypeE.EXAM, num)}
                ></ExamCards>
              </Tabs.TabPane>
              <Tabs.TabPane key={ResourcesTypeE.IMG} tab="图片">
                <ImgCards
                  data={{ count: current.image_objs.length, results: current.image_objs }}
                  searchQuery={searchQuery[tabKey]}
                  onChangePagination={(num): void => updateSearchQuery(ResourcesTypeE.IMG, num)}
                ></ImgCards>
              </Tabs.TabPane>
              <Tabs.TabPane key={ResourcesTypeE.PDF} tab="PDF">
                <PdfTable
                  data={{ count: current.pdf_objs.length, results: current.pdf_objs }}
                  searchQuery={searchQuery[tabKey]}
                  onChangePagination={(num): void => updateSearchQuery(ResourcesTypeE.PDF, num)}
                ></PdfTable>
              </Tabs.TabPane>
              <Tabs.TabPane key={ResourcesTypeE.LUNG_NODULES_REPORT} tab="肺结节AI筛查报告">
                <LungNodulesReportCards
                  data={{ count: current.ai_report_objs.length, results: current.ai_report_objs }}
                  searchQuery={searchQuery[tabKey]}
                  onChangePagination={(num): void =>
                    updateSearchQuery(ResourcesTypeE.LUNG_NODULES_REPORT, num)
                  }
                ></LungNodulesReportCards>
              </Tabs.TabPane>
            </Tabs>
          </div>
        ) : (
          <div className="case-empty">未发现此病例</div>
        )}
      </Spin>
    </section>
  );
};

export default Case;
