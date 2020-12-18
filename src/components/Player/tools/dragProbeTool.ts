import cornerstone from "cornerstone-core";
import csTools from "cornerstone-tools";
import { DEFAULT_SETTINGS } from "../Contents";

const BaseTool = csTools.importInternal("base/BaseTool");
const getNewContext = csTools.importInternal("drawing/getNewContext");
const draw = csTools.importInternal("drawing/draw");
const setShadow = csTools.importInternal("drawing/setShadow");
const drawTextBox = csTools.importInternal("drawing/drawTextBox");

function defaultStrategy(e: any): void {
  // const config = this.configuration;
  const eventData = e.detail;
  const { element, image, currentPoints, canvasContext } = eventData;

  const context = getNewContext(canvasContext.canvas);

  const color = DEFAULT_SETTINGS.activeColor;
  const fontHeight = 15;

  const x = Math.round(currentPoints.image.x);
  const y = Math.round(currentPoints.image.y);

  if (x < 0 || y < 0 || x >= image.columns || y >= image.rows) {
    return;
  }

  draw(context, (context: any) => {
    setShadow(context, {});

    const storedPixels = cornerstone.getStoredPixels(element, x, y, 1, 1);

    const sp = storedPixels[0];
    const hu = sp * image.slope + image.intercept;

    // Draw text
    const str = `value: ${parseFloat(hu.toFixed(3))}`;
    const text = `pos: ${x}, ${y}`;

    // Draw text 5px away from cursor
    const textCoords = {
      x: currentPoints.canvas.x + 5,
      y: currentPoints.canvas.y - 5,
    };

    drawTextBox(context, str, textCoords.x, textCoords.y, color);
    drawTextBox(context, text, textCoords.x, textCoords.y + fontHeight + 5, color);
  });
}

const defaultProps = {
  name: "McDragProbe",
  strategies: {
    default: defaultStrategy,
  },
  defaultStrategy: "default",
  supportedInteractionTypes: ["Mouse"],
};

export default class McDragProbeTool extends BaseTool {
  dragEventData: any;

  constructor(props = {}) {
    super(props, defaultProps);

    this.dragEventData = {};
  }

  postMouseDownCallback = (e: any) => {
    const eventData = e.detail;
    const { element } = eventData;

    this.dragEventData = eventData;
    cornerstone.updateImage(element);
  };

  mouseDragCallback = (e: any): void => {
    const eventData = e.detail;
    const { element } = eventData;

    this.dragEventData = eventData;
    cornerstone.updateImage(element);
  };

  mouseUpCallback = (e: any): void => {
    const eventData = e.detail;
    const { element } = eventData;

    this.dragEventData = {};
    cornerstone.updateImage(element);
  };

  renderToolData(evt: any): void {
    if (!this.dragEventData.currentPoints) {
      return;
    }

    if (evt && evt.detail && Boolean(Object.keys(this.dragEventData.currentPoints).length)) {
      evt.detail.currentPoints = this.dragEventData.currentPoints;
      this.applyActiveStrategy(evt);
    }
  }
}
