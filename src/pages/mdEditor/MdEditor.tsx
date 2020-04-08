import React, { FunctionComponent, useRef, useEffect, useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import marked from "marked";

import "./MdEditor.less";
import { getPrivacyNotice } from "_services/user";

const MdEditor: FunctionComponent = () => {
  const $preview = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState("");
  const [current, setCurrent] = useState({ id: -1, content: "" });

  const submit = (updateVersion: boolean): void => {
    let data = { content: val };
    if (updateVersion) data = Object.assign({}, data, { id: current.id });

    // 这里添加更新的API
  };

  useEffect(() => {
    getPrivacyNotice()
      .then((res) => {
        setCurrent(res.data);
        marked(res.data.content, (err: any, res: string) => {
          if ($preview.current) {
            $preview.current.innerHTML = res;
          }
        });
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    marked(val, (err, res) => {
      if ($preview.current) {
        $preview.current.innerHTML = res;
      }
    });
  }, [val]);

  return (
    <div className="md-editor">
      <header className="md-editor-header">
        <h1>用户协议编辑器（Markdown）</h1>
      </header>
      <div className="md-editor-content">
        <div className="md-editor-content-item">
          <h2>Md Input</h2>
          <TextArea
            onInput={(e): void => setVal(e.currentTarget.value)}
            className="md-editor-input"
            value={val || current.content}
            autosize
          ></TextArea>
        </div>
        <div className="md-editor-content-item">
          <h2>Preview</h2>
          <div ref={$preview} className="md-editor-preview"></div>
        </div>
      </div>
      <div className="md-editor-ctl">
        <button className="md-editor-update-content" onClick={(): void => submit(false)}>
          更新当前版本内容
        </button>
        <button className="md-editor-update-version" onClick={(): void => submit(false)}>
          更新用户协议
        </button>
      </div>
    </div>
  );
};

export default MdEditor;
