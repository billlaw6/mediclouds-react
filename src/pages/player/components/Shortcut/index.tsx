import React, { FunctionComponent } from "react";

import keyboard from "_images/keyboard.png";
import mouse from "_images/mouse.png";

import "./style.less";

interface ShortcutPropsI {
  show?: boolean;
  onClose?: Function;
}

const Shortcut: FunctionComponent<ShortcutPropsI> = (props) => {
  const { show, onClose } = props;

  return (
    <section className={`shortcut ${show ? "show" : ""}`}>
      <i
        className="shortcut-close iconfont iconic_guanbi"
        onClick={(): void => onClose && onClose()}
      ></i>
      <header className="shortcut-header">快捷键</header>
      <ul className="shortcut-content">
        <li className="shortcut-item">
          <article className="shortcut-item-text">
            <span>空格：播放/暂停</span>
          </article>
        </li>
        <li className="shortcut-item">
          <article className="shortcut-item-text">
            <span>上下：选择序列</span>
            <span>左右：单张影像播放</span>
          </article>
          <img src={keyboard} alt="shortcut" />
        </li>
        <li className="shortcut-item">
          <article className="shortcut-item-text">
            <span>滚轮：单张影像播放</span>
          </article>
          <img src={mouse} alt="mousewheel" />
        </li>
      </ul>
    </section>
  );
};

export default Shortcut;
