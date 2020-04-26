import React, { FunctionComponent, useRef, useEffect, useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import marked from "marked";

import "./MdEditor.less";
import { getPrivacyNotice, updatePrivacyNotice } from "_services/user";

const domParser = new DOMParser();

const MdEditor: FunctionComponent = () => {
  const $preview = useRef<HTMLIFrameElement>(null);
  const [val, setVal] = useState("");
  const [current, setCurrent] = useState({ id: -1, content: "" });

  const submit = (updateVersion: boolean): void => {
    let data = { content: val || current.content };
    if (updateVersion) data = Object.assign({}, data, { id: current.id });

    // 这里添加更新的API
    updatePrivacyNotice(data)
      .then(() => alert("更新成功！"))
      .catch((err) => {
        console.error(err);
        alert("更新失败，请查看console");
      });
  };

  const parseMd = (err: any, res: string): void => {
    if (err) throw new Error(err);
    if ($preview.current && $preview.current.contentDocument) {
      const parseBody = domParser.parseFromString(res, "text/html").body;
      $preview.current.contentDocument.body.innerHTML = parseBody.innerHTML;
    }
  };

  useEffect(() => {
    getPrivacyNotice()
      .then((res) => {
        setCurrent(res.data);
        marked(res.data.content, parseMd);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    marked(val, parseMd);
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
            autoSize
          ></TextArea>
        </div>
        <div className="md-editor-content-item">
          <h2>Preview</h2>
          <iframe
            className="md-editor-preview"
            width="100%"
            height="600px"
            ref={$preview}
            name="preview"
            marginHeight={16}
            marginWidth={16}
            srcDoc={`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>mdeditor preview</title>
            </head>
            <body>
            </body>
            </html>
            `}
            sandbox="allow-scripts allow-same-origin allow-top-navigation-by-user-activation"
          ></iframe>
        </div>
      </div>
      <div className="md-editor-ctl">
        <button className="md-editor-update-content" onClick={(): void => submit(true)}>
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
