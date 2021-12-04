import { Color } from "three";
import { createElemObject } from "../helper/css3d";

const w = 45;
const h = w * 1.5;
const xOffset = -15;
const padding = w / 9;
const yOffset_bot = -6;
const yOffset_top = 4.5;

export default class Poster {
  constructor(imageDomRef) {
    this.imageDomRef = imageDomRef;
  }

  init(index) {
    let imageObj = createElemObject(
      this.imageDomRef,
      w,
      h,
      new Color(0xfc6b68),
      1,
      true
    );
    imageObj.lightShadowMesh.rotation.set(0, 0, 0.1);
    let yOffset = index % 2 === 0 ? yOffset_bot : yOffset_top;
    imageObj.position.set(xOffset + index * padding, yOffset, -1);
    return imageObj;
  }
}
