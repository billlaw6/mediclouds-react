import React, { FunctionComponent } from "react";
import Uploader from "_components/Uploader";

const Home: FunctionComponent = () => {
  return (
    <div className="home">
      <h1>上传dicom，AI智能筛查肺结节</h1>
      <Uploader></Uploader>
    </div>
  );
};

export default Home;
