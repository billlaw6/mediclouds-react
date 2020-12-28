/* eslint-disable react/display-name */
import React, { FunctionComponent } from "react";
import AccountListCmp from "_components/AccountList";

import useAccount from "_hooks/useAccount";
import { RoleE } from "mc-api";

import "./style.less";

const AccountList: FunctionComponent = () => {
  const { account } = useAccount();
  const { role } = account;

  const filterRole: RoleE[] = [RoleE.EMPLOYEE];
  if (role === RoleE.BUSINESS) filterRole.push(RoleE.MANAGER);

  return (
    <div className="manager-account-list">
      <AccountListCmp
        id={account.id}
        filterRole={filterRole}
        filterCol={["business_name"]}
      ></AccountListCmp>
    </div>
  );
};

export default AccountList;
