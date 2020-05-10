import {elements, canvas, updateCircuit} from "./render.js";

let selectedElement;
let selectionMoving;

const controlsTag = document.getElementById("element-controls");
const buttonDestroy = document.getElementById("destroy-element");

function selectInput(element) {

}

function select(element) {
  if(selectedElement) selectedElement.highlighted = false;
  element.highlighted = true;

  const inputsTag = document.getElementById("element-inputs");
  inputsTag.append(element.inputOffsets.map((it, i) => {
    const buttonSelectInput = document.createElement("button");

    buttonSelectInput.innerText = `Select input #${i + 1}`;

    buttonSelectInput.addEventListener("click", () => selectInput(element));
    buttonDestroy.addEventListener("click", () => {
      elements.splice(elements.indexOf(element));
      deselect(element);
    })

    return buttonSelectInput;
  }));

  controlsTag.hidden = false;

  selectedElement = element;
  dispatchEvent(updateCircuit);
}

function deselect(element) {
  element.highlighted = false;
  dispatchEvent(updateCircuit);
}

function clearSelection() {
  if(selectedElement) deselect(selectedElement);

  controlsTag.hidden = true;

  selectedElement = undefined;
}

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
      select(found);
      selectionMoving = true;
    } else {
      clearSelection()
    }
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