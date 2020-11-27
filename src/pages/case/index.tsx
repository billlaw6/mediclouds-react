import { Descriptions, message, PageHeader, Spin, Tabs } from "antd";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { getAgeByBirthday, getSexName } from "_helper";
import useCase from "_hooks/useCase";
import { CaseI } from "_types/case";
import { GetSearchQueryPropsI } from "_types/api";
import { ExamSortKeyE, ImgAndPdfSortKeyE, ReportSortKeyE, ResourcesTypeE } from "_types/resources";
import ExamCards from "_components/ExamCards";
import ImgCards from "_components/ImgCards";
import PdfTable from "_components/PdfTable";

import "./style.less";
import LungNodulesReportCards from "_pages/resources/components/LungNodulesReportCards";

/* 资源当前的页码 */
interface SearchQueryI {
  [key: string]: any;
  [ResourcesTypeE.EXAM]: GetSearchQueryPropsI<"study_date" | "modality">;
  [ResourcesTypeE.IMG]: GetSearchQueryPropsI<"created_at" | "filename">;
  [ResourcesTypeE.PDF]: GetSearchQueryPropsI<"created_at" | "filename">;
  [ResourcesTypeE.LUNG_NODULES_REPORT]: GetSearchQueryPropsI<"created_at">;
}

const Case: FunctionComponent = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { getCase } = useCase();
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
      getCase(id)
        .then((res) => setCurrent(res))
        .catch((err) => {
          console.error(err);
          message.error({
            content: "获取病例失败",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <section className="case">
      <PageHeader
        className="case-header"
        title="病例"
        subTitle={`${current ? `${current.name || "NA"}的病例` : ""}`}
        onBack={(): void => history.push("/case")}
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
