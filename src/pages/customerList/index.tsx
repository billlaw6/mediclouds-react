/* eslint-disable react/display-name */
import React, { FunctionComponent } from "react";
import CustomerListCmp from "_components/CustomerList";
import useAccount from "_hooks/useAccount";

const CustomerList: FunctionComponent = (props) => {
  const { account } = useAccount();

  return (
    <div className="manager-customer-list">
      <CustomerListCmp id={account.id}></CustomerListCmp>
    </div>
  );
};

export default CustomerList;
