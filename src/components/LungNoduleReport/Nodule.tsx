import { Col, Descriptions, Row, Space } from "antd";
import React, { FunctionComponent } from "react";
import { LungNoduleI } from "_types/ai";

import "./nodule.less";

interface NodulePropsI {
  data: LungNoduleI;
  index: number;
}

const Nodule: FunctionComponent<NodulePropsI> = (props) => {
  const { data, index } = props;

  const {
    id,
    origin_img_url,
    image_details,
    disp_z,
    vol,
    long_axis,
    short_axis,
    solid_axis,
    solid_ratio,
    cal_ratio,
    gg_ratio,
    max_hu,
    min_hu,
    mean_hu,
  } = data;

  return (
    <article className="lung-nodule">
      <header>第{index}个结节</header>
      <Row>
        <Col span={10}>
          <div
            className="lung-nodule-cover"
            style={{
              backgroundImage: `url(${origin_img_url})`,
            }}
          ></div>
        </Col>
        <Col span={14}>
          <div className="lung-nodule-preview">
            <span className="lung-nodule-preview-title">结节三轴预览</span>
            <div className="lung-nodule-preview-imgs">
              <Space direction="vertical">
                <span>横断面（z）</span>
                <img src={image_details.z_image}></img>
              </Space>
              <Space direction="vertical">
                <span>矢状面（x）</span>
                <img src={image_details.x_image}></img>
              </Space>
              <Space direction="vertical">
                <span>冠状面（y）</span>
                <img src={image_details.y_image}></img>
              </Space>
            </div>
          </div>
          <div className="lung-nodule-report">
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="位置(帧)">{disp_z}</Descriptions.Item>
              <Descriptions.Item label="体积(立方毫米)">{vol}</Descriptions.Item>
              <Descriptions.Item label="尺寸(mm x mm)">{`${long_axis} x ${short_axis}`}</Descriptions.Item>
              <Descriptions.Item label="实性部分长轴(mm)">
                {Math.round(solid_axis * 100) / 100}
              </Descriptions.Item>
              <Descriptions.Item label="实性部分比例(%)">
                {!solid_ratio ? "-" : `${Math.round(solid_ratio * 100)}`}
              </Descriptions.Item>
              <Descriptions.Item label="钙化比例(%)">
                {Math.round(cal_ratio * 100)}
              </Descriptions.Item>
              <Descriptions.Item label="膜玻璃比例(%)">
                {Math.round(gg_ratio * 100)}
              </Descriptions.Item>
              <Descriptions.Item label="最大CT值">{max_hu}</Descriptions.Item>
              <Descriptions.Item label="最小CT值">{min_hu}</Descriptions.Item>
              <Descriptions.Item label="平均CT值">{mean_hu}</Descriptions.Item>
            </Descriptions>
          </div>
        </Col>
      </Row>
    </article>
  );
};

export default Nodule;
