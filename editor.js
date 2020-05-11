import {elements, canvas, updateCircuit} from "./render.js";

let selectedElement;
let selectionMoving;
let selectingInput;

const controlsTag = document.getElementById("element-controls");
const buttonDestroy = document.getElementById("destroy-element");

function select(element) {
  if(selectedElement) selectedElement.highlighted = false;
  element.highlighted = true;

  const inputsTag = document.getElementById("element-inputs");
  inputsTag.innerHTML = "";

  element.inputFrom.forEach((it, i) => {
    const buttonSelectInput = document.createElement("button");

    buttonSelectInput.innerText = `Select input #${i + 1}`;

    function selectInputListener() {
      buttonSelectInput.removeEventListener("click", selectInputListener);

      selectingInput = {element: element, index: i}
    }

    function destroyListener() {
      buttonSelectInput.removeEventListener("click", destroyListener);

      elements.splice(elements.indexOf(element));
      deselect(element);
    }

    buttonSelectInput.addEventListener("click", selectInputListener);
    buttonDestroy.addEventListener("click", destroyListener)

    inputsTag.appendChild(buttonSelectInput);
  })

  selectedElement = element;
  controlsTag.hidden = false;

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
      (it.imagePosition[0] <= e.clientX)
      && (it.imagePosition[1] <= e.clientY)
      && (it.imagePosition[0] + it.image.width > e.clientX)
      && (it.imagePosition[1] + it.image.height > e.clientY)
    )).pop();

    if(found && found !== selectedElement) {
      if(selectingInput) {
        selectingInput.element.inputFrom[selectingInput.index] = found;
        selectingInput = undefined;

        dispatchEvent(updateCircuit);
      } else {
        select(found);
        selectionMoving = true;
      }
    } else {
      selectingInput = false;
      clearSelection();
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