import React, { FunctionComponent } from "react";

interface DicomPlayerPropsI {
  id?: string;
}

const DicomPlayer: FunctionComponent<DicomPlayerPropsI> = (props) => {
  return (
    <div id="dicomPlayer" className="player">
      DICOM 浏览器
    </div>
  );
};

export default DicomPlayer;
