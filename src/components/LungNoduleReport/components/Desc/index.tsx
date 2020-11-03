import React, { FunctionComponent } from "react";
import { parseLungNoduleDesc } from "_helper";

interface DescPropsI {
  details?: boolean; // 是否显示详情
  extra?: boolean; // 是否显示扩展信息
}

const Desc: FunctionComponent<DescPropsI> = (props) => {
  const { children, details, extra } = props;

  if (!children || typeof children !== "string") return <article>没有描述</article>;
  const { title, content } = parseLungNoduleDesc(children);

  return (
    <article>
      <header>
        {title}
        {details ? ": " : null}
      </header>
      {details ? (
        <ul>
          {content.map((item, index) => {
            return <li key={`${Date.now()}_desc_${index}`}>{item};</li>;
          })}
        </ul>
      ) : null}
    </article>
  );
};

export default Desc;
