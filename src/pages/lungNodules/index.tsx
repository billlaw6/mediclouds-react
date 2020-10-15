import { Form, Input, message, Modal, PageHeader, Popconfirm, Space, Spin } from "antd";
import React, { FunctionComponent, useState } from "react";
import { useHistory } from "react-router-dom";
import Uploader from "_components/Uploader";
import useAccount from "_hooks/useAccount";
import { SeriesI, SeriesListI, UploaderCellI, UploaderStatusE } from "_types/api";

import "./style.less";

const LungNodules: FunctionComponent = () => {
  const history = useHistory();
  const { account } = useAccount();
  const [series, setSeries] = useState<SeriesI[] | undefined>([
    {
      id: "123",
      thumbnail: "https://www.baidu.com/favicon.ico",
      pictures: [],
      series_number: 1,
      mpr_flag: 0,
      window_width: 300,
      window_center: 300,
      display_frame_rate: 0,
      dicoms: [],
    },
  ]); // 分析的结果
  const [analyzeStatus, setAnalyzeStatus] = useState(false); // 分析的状态
  const [uploaderList, setUploaderList] = useState<UploaderCellI[]>([]); // 上传的列表
  const [selected, setSelected] = useState<SeriesI>(); // 当前已选的序列
  const [report, setReport] = useState<Map<string, any>>(); // 检测报告

  const { score } = account;

  const allSuccessed = !!(
    uploaderList.length && uploaderList.every((item) => item.status === UploaderStatusE.SUCCESS)
  );
  console.log("allSuccessed", allSuccessed);

  /**
   * 获取当前的检测报告
   *
   */
  const getCurrentReport = () => {
    if (!selected || !report) return null;
    const { id } = selected;
    const current = report.get(id);

    if (!current) {
      // fetch current report
      return null;
    } else {
      return <div>report</div>;
    }
  };

  /**
   * 获取可做筛查的序列
   */
  const getSeries = () => {
    // if (!allSuccessed) return null;
    // if (!analyzeStatus) {
    //   return (
    //     <div className="lung-nodules-pending">
    //       <Space>
    //         <Spin />
    //         <span>正在分析中，请不要关闭窗口</span>
    //       </Space>
    //     </div>
    //   );
    // }
    if (series) {
      return (
        <div className="lung-nodules-result">
          {series.length ? (
            <Space>
              {series.map((item) => {
                const { id, thumbnail } = item;

                return (
                  <Popconfirm
                    key={id}
                    title="确定扣除1000积分筛查吗？"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={(): void => {
                      if (score >= 1000) {
                        message.error("积分不足");
                      } else {
                        setSelected(item);
                      }
                    }}
                  >
                    <div className="lung-nodules-result-item">
                      <div
                        className="lung-nodules-result-item-thumb"
                        style={{ backgroundImage: `url(${thumbnail})` }}
                      ></div>
                      <div className="lung-nodules-result-item-flag"></div>
                    </div>
                  </Popconfirm>
                );
              })}
            </Space>
          ) : (
            <span>没有可以筛查的DICOM</span>
          )}
        </div>
      );
    } else {
      return null;
    }
  };

  const currentReport = getCurrentReport();

  return (
    <div className="lung-nodules">
      <PageHeader
        title="肺结节筛查"
        subTitle="上传DICOM影像，分析肺结节"
        onBack={(): void => history.goBack()}
      ></PageHeader>
      <div className="lung-nodules-content">
        <Uploader
          onChange={(uploaderList, progressNode): void => setUploaderList(uploaderList)}
        ></Uploader>
        {getSeries()}
      </div>
      <Modal visible={!!(selected && currentReport)} title="检测结果">
        {currentReport}
      </Modal>
    </div>
  );
};

export default LungNodules;
