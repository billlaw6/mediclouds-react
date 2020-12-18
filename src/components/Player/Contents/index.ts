import { CstToolNameT } from "../types/common";

export const DEFAULT_SETTINGS = {
  textStyle: "#F7E107",
  activeColor: "#E36B00",
};

export const CST_TOOL_NAMES: CstToolNameT[] = ["Length", "Pan", "Wwwc", "Zoom"];

export const WWWC_PRESETS = [
  { title: "默认", id: "DEFAULT", value: "DEFAULT" },
  { title: "胸窗", id: "chest", value: "40/350" }, // wc/ww
  { title: "腹窗", id: "abdomen", value: "60/360" },
  { title: "肺窗", id: "lung", value: "-400/1500" },
  { title: "骨窗", id: "bone", value: "480/2500" },
  { title: "头颅窗", id: "head", value: "90/350" },
  { title: "脑窗", id: "brain", value: "40/80" },
  { title: "心脏窗", id: "heart", value: "300/800" },
];
