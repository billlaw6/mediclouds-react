import React, { FunctionComponent } from "react";
import { Redirect, Route, Switch, useLocation, useParams } from "react-router-dom";
import DefalutLayout from "_layout/Default/Default";
import LungNodules from "_pages/lungNodules";

const AILayout: FunctionComponent = () => {
  const { name } = useParams<{ name: string }>();

  const getContent = () => {
    switch (name) {
      case "lung-nodules":
        return <LungNodules></LungNodules>;
      default:
        return <Redirect to="/404"></Redirect>;
    }
  };

  return <DefalutLayout>{getContent()}</DefalutLayout>;
};

export default AILayout;
