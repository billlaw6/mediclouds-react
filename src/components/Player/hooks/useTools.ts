import useData from "./useData";
import useWindows from "./useWindows";

export default () => {
  const { cs, cst } = useData();
  const { getFocusWindow } = useWindows();

  const activeTool = (name: string, settings?: any): void => {
    const { element } = getFocusWindow() || {};
    if (!cst || !element) return;

    cst.setToolActiveForElement(element, name, settings);
  };

  const setToolOption = (name: string, opts: any): void => {
    const { element } = getFocusWindow() || {};
    if (!cst || !element) return;

    cst.setToolOptionForElement(element, name, opts);
  };

  const passiveTool = (name: string): void => {
    const { element } = getFocusWindow() || {};
    if (!cst || !element) return;

    cst.setToolPassiveForElement(element, name);
  };

  return { cs, cst, activeTool, passiveTool, setToolOption };
};
