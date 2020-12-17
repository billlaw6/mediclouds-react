import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Select, Tabs } from "antd";
import moment from "moment";
import React, { FunctionComponent, useState } from "react";
import ExamCards from "_components/ExamCards";
import ImgCards from "_components/ImgCards";
import PdfTable from "_components/PdfTable";
import { formatDate } from "_helper";
import useCase from "_hooks/useCase";

import { LungNoduleReportI } from "_types/ai";
import { GetSearchQueryPropsI } from "_types/api";
import { CreateCaseDataI } from "_types/case";
import {
  ExamIndexI,
  ExamSortKeyE,
  ImgAndPdfSortKeyE,
  ImgI,
  PdfI,
  ReportSortKeyE,
  ResourcesTypeE,
} from "_types/resources";
import LungNodulesReportCards from "../LungNodulesReportCards";

interface CreateCasePropsI {
  show: boolean; // 是否显示
  [ResourcesTypeE.EXAM]?: ExamIndexI[];
  [ResourcesTypeE.IMG]?: ImgI[];
  [ResourcesTypeE.PDF]?: PdfI[];
  [ResourcesTypeE.LUNG_NODULES_REPORT]?: LungNoduleReportI[];
  onCreateCase?: Function;
  onCancel?: Function;
}

/* 资源当前的页码 */
interface SearchQueryI {
  [key: string]: any;
  [ResourcesTypeE.EXAM]: GetSearchQueryPropsI<"study_date" | "modality">;
  [ResourcesTypeE.IMG]: GetSearchQueryPropsI<"created_at" | "filename">;
  [ResourcesTypeE.PDF]: GetSearchQueryPropsI<"created_at" | "filename">;
  [ResourcesTypeE.LUNG_NODULES_REPORT]: GetSearchQueryPropsI<"created_at">;
}

const { Item: FormItem } = Form;
const { TabPane } = Tabs;

const CreateCase: FunctionComponent<CreateCasePropsI> = (props) => {
  const { createCase: createCaseFunction } = useCase();
  const { show, exam, pdf, img: imgs, lung_nodules_report, onCancel, onCreateCase } = props;
  const [form] = Form.useForm();

  const [tabKey, setTabKey] = useState<ResourcesTypeE>(ResourcesTypeE.EXAM); // 当前tab key
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

  const createCase = (): void => {
    const info = form.getFieldsValue();
    info.birthday = formatDate(info.birthday.toString());
    const createCaseData: CreateCaseDataI = Object.assign({}, info);
    if (exam) createCaseData.exams = exam.map((item) => item.id);
    if (pdf) createCaseData.pdfs = pdf.map((item) => item.id);
    if (imgs) createCaseData.imgs = imgs.map((item) => item.id);
    if (lung_nodules_report) createCaseData.ai_reports = lung_nodules_report.map((item) => item.id);

    createCaseFunction(createCaseData)
      .then((res) => {
        message.success({
          content: "创建病例成功！",
        });
        onCreateCase && onCreateCase();
      })
      .catch((err) => {
        message.error({
          content: "创建病例失败！",
        });
        console.error(err);
      });
  };

  return (
    <Modal
      visible={show}
      title="创建病例"
      footer={
        <div className="create-case-footer">
          <Button type="default" onClick={(): void => onCancel && onCancel()}>
            取消
          </Button>
          <Popconfirm title="确定创建病例吗？" onConfirm={createCase}>
            <Button type="primary">创建（限时免费）</Button>
          </Popconfirm>
        </div>
      }
      maskClosable={false}
      onCancel={(): void => onCancel && onCancel()}
      destroyOnClose
      width={1000}
    >
      <Form
        form={form}
        wrapperCol={{ span: 14 }}
        initialValues={{
          name: "",
          sex: 0,
          birthday: moment("1900-01-01"),
          description: "",
        }}
      >
        <FormItem label="姓名" name="name">
          <Input></Input>
        </FormItem>
        <FormItem label="性别" name="sex">
          <Select>
            <Select.Option value={0}>保密</Select.Option>
            <Select.Option value={1}>男</Select.Option>
            <Select.Option value={2}>女</Select.Option>
          </Select>
        </FormItem>
        <FormItem label="出生日期" name="birthday">
          <DatePicker></DatePicker>
        </FormItem>
        <FormItem label="病例描述" name="description">
          <Input.TextArea maxLength={100} showCount></Input.TextArea>
        </FormItem>
      </Form>
      <Tabs activeKey={tabKey} onChange={(key): void => setTabKey(key as ResourcesTypeE)}>
        <TabPane key={ResourcesTypeE.EXAM} tab="检查">
          <ExamCards
            data={{ count: exam ? exam.length : 0, results: exam || [] }}
            searchQuery={searchQuery[tabKey]}
            disabledDesc
            disabledAi
            disabledEmptyTip
            onChangePagination={(num): void => updateSearchQuery(ResourcesTypeE.EXAM, num)}
          ></ExamCards>
        </TabPane>
        <TabPane key={ResourcesTypeE.IMG} tab="图片">
          <ImgCards
            data={{ count: imgs ? imgs.length : 0, results: imgs || [] }}
            searchQuery={searchQuery[tabKey]}
            onChangePagination={(num): void => updateSearchQuery(ResourcesTypeE.IMG, num)}
          ></ImgCards>
        </TabPane>
        <TabPane key={ResourcesTypeE.PDF} tab="PDF">
          <PdfTable
            data={{ count: pdf ? pdf.length : 0, results: pdf || [] }}
            searchQuery={searchQuery[tabKey]}
            onChangePagination={(num): void => updateSearchQuery(ResourcesTypeE.PDF, num)}
          ></PdfTable>
        </TabPane>
        <TabPane key={ResourcesTypeE.LUNG_NODULES_REPORT} tab="肺结节AI筛查报告">
          <LungNodulesReportCards
            data={{
              count: lung_nodules_report ? lung_nodules_report.length : 0,
              results: lung_nodules_report || [],
            }}
            searchQuery={searchQuery[tabKey]}
            onChangePagination={(num): void =>
              updateSearchQuery(ResourcesTypeE.LUNG_NODULES_REPORT, num)
            }
          ></LungNodulesReportCards>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default CreateCase;
