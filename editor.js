import {elements, canvas, updateCircuit} from "./render.js";

let selectedElement;
let selectionMoving;

canvas.addEventListener("mousedown", e => {
  if(!selectionMoving) {
    const found = elements.filter(it => (
      (it.image)
      && (it.imagePosition[0] <= e.clientX)
      && (it.imagePosition[1] <= e.clientY)
      && (it.imagePosition[0] + it.image.width > e.clientX)
      && (it.imagePosition[1] + it.image.height > e.clientY)
    )).pop();

    if(found) {
      if(selectedElement) selectedElement.highlighted = false;
      found.highlighted = true;

      selectedElement = found;
      selectionMoving = true;
    } else {
      if(selectedElement) selectedElement.highlighted = false;
      selectedElement = undefined;
    }

    dispatchEvent(updateCircuit);
  }
});

canvas.addEventListener("mousemove", e => {
  if(selectedElement && selectionMoving) {
    selectedElement.x = e.clientX;
    selectedElement.y = e.clientY;

    dispatchEvent(updateCircuit);
  }
});

canvas.addEventListener("mouseup", () => {
  if(selectionMoving) selectionMoving = false;
});