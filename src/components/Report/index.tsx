import React, { FunctionComponent } from "react";
import { ReportI } from "_types/resources";

interface ReportPropsI {
  data?: ReportI;
}

const Report: FunctionComponent<ReportPropsI> = (props) => {
  const { data } = props;

  return <section className="report"></section>;
};

export default Report;
