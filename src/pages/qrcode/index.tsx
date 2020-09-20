import React, { FunctionComponent } from "react";
import QrcodeGenerator from "qrcode.react";
import useAccount from "_hooks/useAccount";
import { RoleE } from "_types/account";

import config from "_config";

import "./style.less";

const Qrcode: FunctionComponent = () => {
  const { account } = useAccount();
  const { id, role, first_name, last_name, business_name } = account;

  return (
    <div className="qrcode">
      <div className="qrcode-register">
        <h2 className="qrcode-title">注册二维码</h2>
        <div className="qrcode-content">
          <QrcodeGenerator
            value={`${config.registerBaseUrl}/?id=${encodeURI(id)}&name=${
              role === RoleE.BUSINESS ? business_name : `${first_name}${last_name}`
            }`}
            size={256}
          ></QrcodeGenerator>
        </div>
      </div>
      {/* <div className="qrcode-pay">
        <h2 className="qrcode-title">付款二维码</h2>
        <div className="qrcode-content"></div>
      </div> */}
    </div>
  );
};

export default Qrcode;
