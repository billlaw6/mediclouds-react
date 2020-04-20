/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent, useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Switch,
  DatePicker,
  Radio,
  Upload,
  Button,
  AutoComplete,
  message,
} from "antd";
import { EditorPanelPropsI } from "_pages/gallery/type";

import { isUndefined } from "util";
import moment from "moment";

import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload/interface";
import { uploadPublicImage, updatePublicImage } from "_services/dicom";

import "./EditorPanel.less";

/* 

  upload_to = 上传文件路径
  md5 = 文件的MD5值
  source = 来源类型 
  doi = 文章DOI值 
  title = 文章标题 
  journal = 杂志 
  authors = 作者 
  source_url = 资源链接 
  description = 描述 
  figure_series = 图片在文章里的序列号 
  pictures = 图片url地址数组
  dicom_flag = 是否是DICOM文件 
  flag = 可视标志 
  published_at = 文章发表时间 
  created_at = 资源收录时间

*/

const FormItem = Form.Item;

const EditorPanel: FunctionComponent<EditorPanelPropsI> = (props) => {
  const { isShow, gallery, onCancel, onUpdate, onUpload, uploadMode, seriesIds } = props;
  const [uploadData, setUploadData] = useState<{ [key: string]: any }>({});
  const [validateErr, setValidateErr] = useState<string[]>([]);

  /**
   * 获取显示的值
   *
   * @param {string} key
   * @param {any} queryVale 对比值，如果有这一项，返回的是boolean
   */
  const getVal = (key: string, queryVale?: any): boolean | any => {
    if (queryVale)
      return !isUndefined(uploadData[key])
        ? uploadData[key] === queryVale
        : gallery[key] === queryVale;

    return isUndefined(uploadData[key]) ? gallery[key] : uploadData[key];
  };

  /**
   * 改变即将上传的data
   * 如果值跟源一致  则从即将上传的data内删除
   *
   * @param {string} key
   * @param {any} val
   */
  const changeUploadData = (key: string, val: any): void => {
    let nextUoloadData = Object.assign({}, uploadData);

    if (!isUndefined(nextUoloadData[key]) && gallery[key] === val) {
      delete nextUoloadData[key];
    } else {
      nextUoloadData = Object.assign({}, nextUoloadData, {
        [key]: val,
      });
    }

    setUploadData(nextUoloadData);
  };

  /* 切换开关内容 */
  const changeSwitch = (key: string, checked: boolean): void => {
    const val = checked ? 1 : 0;
    changeUploadData(key, val);
  };

  useEffect(() => {
    if (!isShow) {
      setUploadData({});
    }
  }, [isShow]);

  /**
   * 更新或上传
   */
  const update = async (): Promise<void> => {
    if (validateErr.length) return;

    try {
      const formData = new FormData();
      for (const key in uploadData) {
        if (key === "file") {
          uploadData["file"].forEach((file: File) => {
            formData.append("file", file);
          });
        } else {
          formData.append(key, uploadData[key]);
        }
      }

      if (uploadMode) {
        const res = await uploadPublicImage(formData);
        onUpload && onUpload(res.data);
      } else {
        const id = gallery.id || "";
        formData.append("id", id);
        const res = await updatePublicImage(id, formData);
        onUpdate && onUpdate(res.data);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <Modal
      className="gallery-editor"
      okText={uploadMode ? "提交" : "更新"}
      onCancel={(): void => onCancel && onCancel()}
      onOk={update}
      closable
      visible={isShow}
    >
      <Form name="gallery">
        {uploadMode ? (
          <Row>
            <Col span={12}>
              <FormItem label="上传" htmlFor="upload">
                <Upload
                  name="upload"
                  customRequest={(): void => {
                    //
                  }}
                  multiple
                  onRemove={(file): void => {
                    const files = [...(uploadData["file"] as RcFile[])];
                    if (files) {
                      const index = files.findIndex((item) => item.uid === file.uid);
                      if (index > -1) {
                        files.splice(index, 1);
                        changeUploadData("file", files.length ? files : undefined);
                      }
                    }
                  }}
                  beforeUpload={(file, fileList): boolean => {
                    changeUploadData("file", fileList);
                    return false;
                  }}
                >
                  <Button>
                    <UploadOutlined /> 点击添加资源
                  </Button>
                </Upload>
              </FormItem>
            </Col>
            <Col span={12}></Col>
          </Row>
        ) : null}
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label="标题" htmlFor="title">
              <Input
                name="title"
                onChange={(e): void => changeUploadData("title", e.currentTarget.value)}
                value={getVal("title")}
              ></Input>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="描述" htmlFor="description">
              <Input
                name="description"
                onChange={(e): void => changeUploadData("description", e.currentTarget.value)}
                value={getVal("description")}
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label="英文标题" htmlFor="title_en">
              <Input
                name="title_en"
                onChange={(e): void => changeUploadData("title_en", e.currentTarget.value)}
                value={getVal("title_en")}
              ></Input>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="英文描述" htmlFor="description_en">
              <Input
                name="description_en"
                onChange={(e): void => changeUploadData("description_en", e.currentTarget.value)}
                value={getVal("description_en")}
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <FormItem label="来源类型" htmlFor="source">
              {/* <Input name="source" value={getVal("source")}></Input> */}
              <Radio.Group
                name="source"
                value={getVal("source")}
                onChange={(e): void => changeUploadData("source", e.target.value)}
              >
                <Radio.Button value="article">文章</Radio.Button>
                <Radio.Button value="ppt">幻灯片</Radio.Button>
                <Radio.Button value="public_db">公共数据</Radio.Button>
              </Radio.Group>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="文章DOI值" htmlFor="doi">
              <Input
                name="doi"
                value={getVal("doi")}
                onInput={(e): void => {
                  changeUploadData("doi", e.currentTarget.value);
                }}
              ></Input>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="资源链接"
              validateStatus={validateErr.indexOf("source_url") >= 0 ? "error" : ""}
              help={validateErr.indexOf("source_url") >= 0 ? "请输入正确的url地址" : ""}
              htmlFor="source_url"
              hasFeedback={validateErr.indexOf("source_url") >= 0}
            >
              <Input
                name="source_url"
                onChange={(e): void => {
                  const nextValidateErr = [...validateErr];
                  const i = nextValidateErr.findIndex((item) => item === "source_url");
                  if (new RegExp("^((https?|ftp|file)://).*", "gm").test(e.currentTarget.value)) {
                    if (i > -1) nextValidateErr.splice(i, 1);
                  } else {
                    if (i < 0) nextValidateErr.push("source_url");
                  }

                  changeUploadData("source_url", e.currentTarget.value);
                  setValidateErr(nextValidateErr);
                }}
                value={getVal("source_url")}
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label="作者" htmlFor="authors">
              <Input
                name="authors"
                onChange={(e): void => changeUploadData("authors", e.currentTarget.value)}
                value={getVal("authors")}
              ></Input>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="杂志" htmlFor="journal">
              <Input
                name="journal"
                onChange={(e): void => changeUploadData("journal", e.currentTarget.value)}
                value={getVal("journal")}
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <FormItem label="文章发表时间" htmlFor="published_at">
              <DatePicker
                value={getVal("published_at") ? moment(getVal("published_at")) : null}
                format={"YYYY-MM-DD"}
                onChange={(data, dataString): void => {
                  changeUploadData("published_at", dataString);
                }}
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="是否可见">
              <Switch
                checked={getVal("flag", 1)}
                onChange={(checked): void => changeSwitch("flag", checked)}
              ></Switch>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="序列分组" htmlFor="series_id">
              <AutoComplete
                allowClear
                placeholder="选择或新建分组"
                onChange={(val): void => {
                  changeUploadData("series_id", val);
                }}
                filterOption={(input, option): boolean => {
                  if (!option.props.value) return false;
                  return (
                    option.props.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
              >
                {seriesIds &&
                  seriesIds.map((item) => (
                    <AutoComplete.Option key={item} value={item}>
                      {item}
                    </AutoComplete.Option>
                  ))}
              </AutoComplete>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="图片序列号" htmlFor="figure_series">
              <Input
                disabled={getVal("dicom_flag", 1)}
                name="figure_series"
                value={getVal("figure_series")}
                onInput={(e): void => {
                  changeUploadData("figure_series", e.currentTarget.value);
                }}
              ></Input>
            </FormItem>
          </Col>
        </Row>
        {uploadMode ? null : (
          <Row gutter={24}>
            <Col span={6}>
              <FormItem label="资源收录时间">{gallery.created_at}</FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="md5值">{gallery.md5}</FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="是否为dicom">{gallery.dicom_flag === 1 ? "是" : "否"}</FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="图片">
                <img style={{ width: "100%" }} src={gallery.picture}></img>
              </FormItem>
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  );
};

export default EditorPanel;
