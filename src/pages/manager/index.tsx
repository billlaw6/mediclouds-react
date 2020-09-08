import React, { FunctionComponent, useState, useEffect } from "react";

import AccountStats from "_components/Account/AccountStats";
import useAccount from "_hooks/useAccount";
import { StatsI } from "_types/account";
import { getStats } from "_api/user";

import "./style.less";

const Manager: FunctionComponent = () => {
  const { account } = useAccount();
  const [stats, setStats] = useState<StatsI | null>(null);

  useEffect(() => {
    getStats(account.id)
      .then((res) => setStats(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="manager-dashboard">
      <AccountStats role={account.role} stats={stats}></AccountStats>
    </div>
  );
};

export default Manager;
