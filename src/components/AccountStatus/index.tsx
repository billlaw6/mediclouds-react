import React, { FunctionComponent } from "react";
import Nail from "_components/Nail";

interface AccountStatusPropsI {
  status: 0 | 1;
}

const AccountStatus: FunctionComponent<AccountStatusPropsI> = (props) => {
  const { status } = props;

  return (
    <Nail
      rules={[
        {
          key: "0",
          content: { text: "禁用", color: "red" },
        },
        {
          key: "1",
          content: { text: "启用", color: "green" },
        },
      ]}
      target={`${status}`}
    ></Nail>
  );
};

export default AccountStatus;
