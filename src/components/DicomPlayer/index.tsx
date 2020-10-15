import React, { FunctionComponent } from "react";

interface DicomPlayerPropsI {
  id?: string;
}

const DicomPlayer: FunctionComponent<DicomPlayerPropsI> = (props) => {
  return (
    <div id="dicomPlayer" className="player">
      DICOM 播放器
    </div>
  );
};

export default DicomPlayer;
