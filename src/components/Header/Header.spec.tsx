import React from "react";
import enzyme from "enzyme";
import Header from "./Header";

it("测试框架配置情况", () => {
  const header = enzyme.shallow(<Header />);
  expect(header.find(".header-logo").text()).toEqual("Logo");
});
