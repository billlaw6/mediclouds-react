import React, { FunctionComponent } from "react";
import Nail from "_components/Nail";
import { RoleE } from "mc-api";

interface AccountRolePropsI {
  role: RoleE;
}

const AccountRole: FunctionComponent<AccountRolePropsI> = (props) => {
  return (
    <Nail
      target={props.role}
      rules={[
        { key: RoleE.SUPER_ADMIN, content: { text: "超级管理员", color: "red" } },
        { key: RoleE.BUSINESS, content: { text: "企业", color: "geekblue" } },
        { key: RoleE.MANAGER, content: { text: "经理", color: "volcano" } },
        { key: RoleE.EMPLOYEE, content: { text: "员工", color: "orange" } },
        { key: RoleE.PATIENT, content: { text: "患者", color: "blue" } },
        { key: RoleE.DOCTOR, content: { text: "医生", color: "purple" } },
      ]}
    ></Nail>
  );
};

export default AccountRole;
