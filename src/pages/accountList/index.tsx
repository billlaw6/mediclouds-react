/* eslint-disable react/display-name */
import React, { FunctionComponent } from "react";
import AccountListCmp from "_components/AccountList";

import useAccount from "_hooks/useAccount";

import "./style.less";
import { RoleE } from "_types/account";

const AccountList: FunctionComponent = () => {
  const { account } = useAccount();

  return (
    <div className="manager-account-list">
      <AccountListCmp
        id={account.id}
        filterRole={[RoleE.BUSINESS]}
        filterCol={["business_name"]}
      ></AccountListCmp>
    </div>
  );
};

export default AccountList;
