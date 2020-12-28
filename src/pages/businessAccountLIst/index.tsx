/* eslint-disable react/display-name */
import React, { FunctionComponent } from "react";
import { RoleE } from "mc-api";
import AccountList from "_components/AccountList";
import useAccount from "_hooks/useAccount";

import "./style.less";

const BusinessAccountList: FunctionComponent = () => {
  const { account } = useAccount();

  return (
    <AccountList
      id={account.id}
      filterRole={[RoleE.BUSINESS]}
      filterCol={["role", "cell_phone", "first_name", "last_name", "sex"]}
      searchPlaceholder="搜索企业名称"
    ></AccountList>
  );
};

export default BusinessAccountList;
