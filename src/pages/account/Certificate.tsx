import React, { FunctionComponent, useState } from "react";
import { UserI } from "mc-api";
import { Store } from "antd/lib/form/interface";
import { Upload, Button } from "antd";
import { ImageFileToBase64 } from "_helper";

import "./certificate.less";

interface CertificatePropsI {
  account: UserI;
  onFinish: (vals: Store) => void;
}

const Certificate: FunctionComponent<CertificatePropsI> = (props) => {
  const { account } = props;
  const { certificate } = account;

  const [preImg, setPreImg] = useState<{ file?: File; img?: string }>({});

  const hasCertificate = certificate && certificate.length;
  const previewImg = preImg.img || (certificate && certificate.length ? certificate[0] : "") || "";

  return (
    <div className="account-certificate">
      <div
        className="account-certificate-preview"
        style={{
          backgroundImage: `url(${previewImg})`,
        }}
      ></div>
      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={(file): boolean => {
          ImageFileToBase64(file)
            .then((res) => setPreImg({ file, img: res }))
            .catch((err) => console.error(err));

          return false;
        }}
      >
        <Button>{hasCertificate ? "更新企业资质" : "上传企业资质"}</Button>
      </Upload>
    </div>
  );
};

export default Certificate;
