import React, { FunctionComponent } from "react";
import { Upload, Button } from "antd";
import { AccountI } from "_types/account";

const BusinessInfo: FunctionComponent<AccountI> = (props) => {
  const { certificate, role } = props;

  return (
    <div className="account-business">
      <div className="account-business-cert">
        {certificate.map((item, index) => {
          return (
            <div
              key={`cert_${index}`}
              className="account-business-cert-item"
              style={{ backgroundImage: `url(${item})` }}
            ></div>
          );
        })}
        <Upload>
          {!certificate.length ? (
            <Button type="ghost">上传资质</Button>
          ) : (
            <Button type="primary">重新上传</Button>
          )}
        </Upload>
      </div>
    </div>
  );
};

export default BusinessInfo;
