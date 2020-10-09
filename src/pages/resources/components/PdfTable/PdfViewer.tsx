import { Modal, Pagination } from "antd";
import React, { FunctionComponent, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PdfI } from "_types/resources";

interface PdfViewerPropsI {
  data?: PdfI | null;
  onClose?: Function; // 关闭时触发
}

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const MODAL_PADDIN_SIZE = 24;
const MODAL_WIDTH = 800;

const PdfViewer: FunctionComponent<PdfViewerPropsI> = (props) => {
  const { data, onClose } = props;
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <Modal
      className="pdf-viewer"
      visible={!!data}
      title={data ? data.filename : ""}
      footer={null}
      onCancel={(): void => {
        setNumPages(1);
        setPageNumber(1);
        onClose && onClose();
      }}
      width={MODAL_WIDTH}
      bodyStyle={{ padding: `${MODAL_PADDIN_SIZE}px` }}
    >
      <Document
        file={
          data
            ? process.env.NODE_ENV === "development"
              ? data.url.replace("https://mi.mediclouds.cn", "http://localhost:3001/dev-api") // testPdf
              : data.url
            : null
        }
        loading={"正在加载..."}
        noData={"找不到此文件"}
        error={"加载失败，请重试"}
        onLoadSuccess={(data): void => {
          setNumPages(data.numPages);
        }}
      >
        <Page
          className="pdf-viewer-page"
          pageNumber={pageNumber}
          error={`加载第${pageNumber}失败`}
          loading={`加载第${pageNumber}...`}
          noData={`找不到第${pageNumber}页`}
          width={MODAL_WIDTH - MODAL_PADDIN_SIZE * 2}
        ></Page>
      </Document>
      <Pagination
        total={numPages}
        current={pageNumber}
        pageSize={1}
        onChange={(val): void => setPageNumber(val)}
      ></Pagination>
    </Modal>
  );
};

export default PdfViewer;
