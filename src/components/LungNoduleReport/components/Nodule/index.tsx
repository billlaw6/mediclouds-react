import { Button, Descriptions, Space } from "antd";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { LungNoduleI } from "_types/ai";

import "./style.less";

const VIEWPORT_WIDTH = 410; // 原图区域宽度

interface NodulePropsI {
  data: LungNoduleI;
  index: number; // 第几个结节
  onClick?: (imgIndex: number) => void; // 当点击某个结节的时候 返回节点的disp_z
}

const Nodule: FunctionComponent<NodulePropsI> = (props) => {
  const { devicePixelRatio: pixelRatio } = window;
  const { data, index, onClick } = props;
  const $canvas = useRef<HTMLCanvasElement>(null);
  const $zoomCanvas = useRef<HTMLCanvasElement>(null);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [size, setSize] = useState<[number, number]>(); // canvas尺寸
  const [styleSize, setStyleSize] = useState<[number, number]>([VIEWPORT_WIDTH, 0]); // canvas尺寸
  const [zoomIn, setZoomIn] = useState(false); // 是否放大图片
  const [mousePos, setMousePos] = useState([0, 0]); // 鼠标在图片上的位置

  const {
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
    img_x,
    img_y,
    tex,
    rad_pixel,
  } = data;

  const getTexVal = (tex: 0 | 1 | 2): string => {
    switch (tex) {
      case 0:
        return "磨玻璃";
      case 1:
        return "亚实性";
      case 2:
        return "实性";
      default:
        return "";
    }
  };

  useEffect(() => {
    if ($canvas.current) {
      const ctx = $canvas.current.getContext("2d");

      if (ctx) {
        setCtx(ctx);

        const img = new Image();
        img.src = origin_img_url;
        img.onload = (): void => {
          const imgSize: [number, number] = [img.width * pixelRatio, img.height * pixelRatio];

          const styleHeight = (img.width / img.height) * VIEWPORT_WIDTH;
          setStyleSize([VIEWPORT_WIDTH, styleHeight]);

          setSize(imgSize);
          ctx.drawImage(img, 0, 0, ...imgSize);
          ctx.beginPath();
          ctx.arc(
            img_x * pixelRatio,
            img_y * pixelRatio,
            Math.max(8 * pixelRatio, rad_pixel * pixelRatio),
            0,
            Math.PI * 2,
          );
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2 * pixelRatio;
          ctx.stroke();
        };

        img.onerror = (err): void => console.error(err);
      }
    }
  }, [img_x, img_y, origin_img_url, pixelRatio, rad_pixel]);

  useEffect(() => {
    if (size && zoomIn && ctx && $zoomCanvas.current && $canvas.current && $canvas.current.height) {
      $zoomCanvas.current.setAttribute(
        "style",
        "z-index: 9999; position: absolute; top: 0; right: -300px; background: #c1c1c1; width: 300px; height: 300px; box-shadow: 0px 1px 5px rgba(0, 0, 0, .5);",
      );
      const zoomCanvasWidth = 300 * pixelRatio,
        zoomCanvasHeight = 300 * pixelRatio;

      $zoomCanvas.current.width = zoomCanvasWidth;
      $zoomCanvas.current.height = zoomCanvasHeight;

      const SIZE = 80;
      const [mouseX, mouseY] = mousePos;

      const zoomCtx = $zoomCanvas.current.getContext("2d");

      if (zoomCtx) {
        const { width, height } = $canvas.current.getBoundingClientRect();
        const wRatio = size[0] / width,
          hRatio = size[1] / height;

        const x = (mouseX - SIZE) * wRatio,
          y = (mouseY - SIZE) * hRatio,
          w = SIZE * wRatio * 2,
          h = SIZE * hRatio * 2;

        zoomCtx.drawImage($canvas.current, x, y, w, h, 0, 0, zoomCanvasWidth, zoomCanvasHeight);
      }
    }
  }, [ctx, zoomIn, mousePos, size, pixelRatio]);

  const _size = size || [0, 0];

  return (
    <article className="lung-nodule">
      <header className="lung-nodule-title">第{index}个结节</header>
      <div className="lung-nodule-content">
        <div className="lung-nodule-viewport" style={{ width: `${VIEWPORT_WIDTH}px` }}>
          <canvas
            width={_size[0]}
            height={_size[1]}
            ref={$canvas}
            className="lung-nodule-cover"
            style={{ width: `${styleSize[0]}px`, height: `${styleSize[1]}px` }}
            onMouseOver={(e): void => {
              setZoomIn(true);
            }}
            onMouseOut={(): void => setZoomIn(false)}
            onMouseMove={(e): void => {
              setMousePos([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
            }}
          ></canvas>
          {zoomIn ? <canvas ref={$zoomCanvas}></canvas> : null}
        </div>
        <div className="lung-nodule-detail">
          <div className="lung-nodule-preview">
            <span className="lung-nodule-preview-title">结节三轴预览</span>
            <div className="lung-nodule-preview-imgs">
              <Space className="lung-nodule-preview-imgs-item" direction="vertical">
                <span>横断面（z）</span>
                <img src={image_details.z_image_tag}></img>
              </Space>
              <Space className="lung-nodule-preview-imgs-item" direction="vertical">
                <span>矢状面（x）</span>
                <img src={image_details.x_image_tag}></img>
              </Space>
              <Space className="lung-nodule-preview-imgs-item" direction="vertical">
                <span>冠状面（y）</span>
                <img src={image_details.y_image_tag}></img>
              </Space>
            </div>
          </div>
          <div className="lung-nodule-report">
            <Space className="lung-nodule-report-info" direction="vertical">
              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="位置(帧)">{disp_z}</Descriptions.Item>
                <Descriptions.Item label="体积(立方毫米)">{vol}</Descriptions.Item>
                <Descriptions.Item label="结节材质">{getTexVal(tex)}</Descriptions.Item>
                <Descriptions.Item label="尺寸(mm x mm)">{`${long_axis} x ${short_axis}`}</Descriptions.Item>
                <Descriptions.Item label="实性部分长轴(mm)">
                  {solid_axis ? Math.round(solid_axis * 100) / 100 : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="实性部分比例(%)">
                  {Math.round(solid_ratio * 100)}
                </Descriptions.Item>
                <Descriptions.Item label="钙化比例(%)">
                  {Math.round(cal_ratio * 100)}
                </Descriptions.Item>
                <Descriptions.Item label="磨玻璃比例(%)">
                  {Math.round(gg_ratio * 100)}
                </Descriptions.Item>
                <Descriptions.Item label="最大CT值">{max_hu}</Descriptions.Item>
                <Descriptions.Item label="最小CT值">{min_hu}</Descriptions.Item>
                <Descriptions.Item label="平均CT值">{mean_hu}</Descriptions.Item>
              </Descriptions>
              <Button
                type="ghost"
                onClick={(): void => {
                  onClick && onClick(disp_z);
                }}
              >
                跳转到播放器相应帧
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Nodule;
