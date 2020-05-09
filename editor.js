import {elements, updateCircuit} from "./render.js";

let selectedElement;
let selectionMoving;

addEventListener("mousedown", e => {
  if(!selectionMoving) {
    const found = elements.filter(it => (
      (it.image)
      && (it.imagePosition[0] <= e.clientX)
      && (it.imagePosition[1] <= e.clientY)
      && (it.imagePosition[0] + it.image.width > e.clientX)
      && (it.imagePosition[1] + it.image.height > e.clientY)
    )).pop();

    if(found) {
      selectedElement = found;
      selectionMoving = true;
    }
  }
});

addEventListener("mousemove", e => {
  if(selectedElement && selectionMoving) {
    selectedElement.x = e.clientX;
    selectedElement.y = e.clientY;

    dispatchEvent(updateCircuit);
  }
});

addEventListener("mouseup", e => {
  if(selectionMoving) selectionMoving = false;
});