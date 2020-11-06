import React, { FunctionComponent } from "react";
import { parseLungNoduleDesc } from "_helper";
import { Badge, List, Tabs } from "antd";

interface DescPropsI {
  details?: boolean; // 是否显示详情
  extra?: boolean; // 是否显示扩展信息
  tab?: boolean; // 是否启用详情按实性分类展示
}

const { TabPane } = Tabs;

const Desc: FunctionComponent<DescPropsI> = (props) => {
  const { children, details, tab, extra } = props;

  const getContent = (content: string[]) => {
    return (
      <List
        size="small"
        dataSource={content}
        renderItem={(val) => <List.Item>{val}</List.Item>}
        locale={{ emptyText: "没有此类型的结节" }}
      ></List>
    );
  };

  if (!children || typeof children !== "string") return <article>没有描述</article>;
  const { title, content, extra: extraResult } = parseLungNoduleDesc(children);

  let tabContents: string[][] = [];

  if (details && tab) {
    console.log("content", content);
    const solid: string[] = [],
      subSolid: string[] = [],
      groundGlass: string[] = [];

    content.forEach((item) => {
      if (item.indexOf("实性") > -1) solid.push(item);
      else if (item.indexOf("亚实性") > -1) subSolid.push(item);
      else if (item.indexOf("磨玻璃") > -1) groundGlass.push(item);

      tabContents = [solid, subSolid, groundGlass];
    });
  }

  const [solid, subSolid, groundGlass] = tabContents;

  return (
    <article>
      <header>
        {title}
        {extra && extraResult ? `，${extraResult.title}` : null}
        {details ? ": " : null}
      </header>
      {details ? (
        tab ? (
          <Tabs>
            <TabPane
              tab={
                <Badge size="small" count={solid ? solid.length : 0} offset={[6, 0]}>
                  <span>实性</span>
                </Badge>
              }
              key={0}
            >
              {getContent(solid)}
            </TabPane>
            <TabPane
              tab={
                <Badge size="small" count={subSolid ? subSolid.length : 0} offset={[6, 0]}>
                  <span>亚实性</span>
                </Badge>
              }
              key={1}
            >
              {getContent(subSolid)}
            </TabPane>
            <TabPane
              tab={
                <Badge size="small" count={groundGlass ? groundGlass.length : 0} offset={[6, 0]}>
                  <span>磨玻璃</span>
                </Badge>
              }
              key={2}
            >
              {getContent(groundGlass)}
            </TabPane>
            {extra && extraResult ? (
              <TabPane
                tab={
                  <Badge size="small" count={extraResult.content.length || 0} offset={[6, 0]}>
                    <span>疑似结节</span>
                  </Badge>
                }
                key={3}
              >
                {getContent(extraResult.content)}
              </TabPane>
            ) : null}
          </Tabs>
        ) : (
          getContent(content)
        )
      ) : null}
    </article>
  );
};

export default Desc;
