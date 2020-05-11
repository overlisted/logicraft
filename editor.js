import {elements, canvas, updateCircuit} from "./render.js";
import * as logic from "./logic.js"

let selectedElement;
let selectionMoving;
let selectingInput;

document.getElementById("new-input").onclick = () => {
  elements.push(new logic.PlayerInput(window.innerWidth / 2, window.innerHeight / 2));
  dispatchEvent(updateCircuit);
};

document.getElementById("new-diode").onclick = () => {
  elements.push(new logic.Diode(window.innerWidth / 2, window.innerHeight / 2));
  dispatchEvent(updateCircuit);
};

document.getElementById("new-not").onclick = () => {
  elements.push(new logic.NOT(window.innerWidth / 2, window.innerHeight / 2));
  dispatchEvent(updateCircuit);
};

document.getElementById("new-or").onclick = () => {
  elements.push(new logic.OR(window.innerWidth / 2, window.innerHeight / 2));
  dispatchEvent(updateCircuit);
};

document.getElementById("new-and").onclick = () => {
  elements.push(new logic.AND(window.innerWidth / 2, window.innerHeight / 2));
  dispatchEvent(updateCircuit);
};

document.getElementById("new-xor").onclick = () => {
  elements.push(new logic.XOR(window.innerWidth / 2, window.innerHeight / 2));
  dispatchEvent(updateCircuit);
};

document.getElementById("new-lamp").onclick = () => {
  elements.push(new logic.Lamp(window.innerWidth / 2, window.innerHeight / 2));
  dispatchEvent(updateCircuit);
};

const controlsTag = document.getElementById("element-controls");
const buttonDestroy = document.getElementById("destroy-element");

function select(element) {
  if(selectedElement) selectedElement.highlighted = false;
  element.highlighted = true;

  const inputsTag = document.getElementById("element-inputs");
  inputsTag.innerHTML = "";

  for(let i = 0; i < element.inputFrom.length; i++) {
    const buttonSelectInput = document.createElement("button");

    buttonSelectInput.innerText = `Select input #${i + 1}`;

    function selectInputListener() {
      buttonSelectInput.removeEventListener("click", selectInputListener);

      selectingInput = {element: element, index: i}
    }

    function destroyListener() {
      buttonSelectInput.removeEventListener("click", destroyListener);

      if(!element.destroyed) {
        elements.splice(elements.indexOf(element), 1);
        element.destroyed = true;
      }

      clearSelection();
    }

    buttonSelectInput.addEventListener("click", selectInputListener);
    buttonDestroy.addEventListener("click", destroyListener)

    inputsTag.appendChild(buttonSelectInput);
  }

  selectedElement = element;
  controlsTag.hidden = false;

  dispatchEvent(updateCircuit);
}

function deselect(element) {
  element.highlighted = false;
}

function clearSelection() {
  if(selectedElement) deselect(selectedElement);

  controlsTag.hidden = true;
  selectedElement = undefined;

  dispatchEvent(updateCircuit);
}

canvas.addEventListener("mousedown", e => {
  if(e.button === 0 && !selectionMoving) {
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

canvas.addEventListener("click", e => {
  const found = elements.filter(it => (
    (it.imagePosition[0] <= e.clientX)
    && (it.imagePosition[1] <= e.clientY)
    && (it.imagePosition[0] + it.image.width > e.clientX)
    && (it.imagePosition[1] + it.image.height > e.clientY)
  )).pop();

  if(found) {
    found.onclick(e);
  }
})