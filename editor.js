import {elements, canvas, updateCircuit} from "./render.js";
import * as logic from "./logic.js"

let selectedElement;
let selectionMoving;
let selectingInput;

let truthTableEnabled = false;

const truthTable = document.querySelector("#truth-table");

document
  .getElementById("truth-table-enable")
  .addEventListener("click", () => {
    truthTableEnabled = !truthTableEnabled;
    dispatchEvent(updateCircuit);
  })

addEventListener("circuitUpdate", () => {
  truthTable.innerHTML = "";
  if(truthTableEnabled) {
    const elementsCopy = [...elements];

    let inputsOutput = 0;

    const allInputs = elementsCopy.filter(it => it instanceof logic.PlayerInput);
    const allLamps = elementsCopy.filter(it => it instanceof logic.Lamp);
    const rows = allInputs.length * allLamps.length;

    for(let i = 0; i < rows; i++) {
      const row = document.createElement("tr");

      for(const lamp of allLamps) {
        for(let [index, input] of allInputs.entries()) {
          input.outputs[0] = (inputsOutput >> index) & 1;
          console.log(Math.random(), input.outputs[0])
        }

        inputsOutput++;
      }

      let cell;

      cell = document.createElement("td");
      cell.innerText = allInputs.map(it => it.outputs[0] ? "0" : "1").join(", ");
      row.appendChild(cell);

      cell = document.createElement("td");
      cell.innerText = allLamps.map(it => it.outputs[0] ? "0" : "1").join(", ");
      row.appendChild(cell);

      truthTable.appendChild(row);
    }
  }
});

for(const title of document.getElementsByClassName("window-title")) {
  title.parentElement.style.left = 0;
  title.parentElement.style.top = 0;

  title.addEventListener("mousedown", e => {
    e.target.dragging = true;
  });

  title.addEventListener("mousemove", e => {
    if(e.target.dragging) {
      e.target.parentElement.style.left = parseInt(e.target.parentElement.style.left) + e.movementX;
      e.target.parentElement.style.top = parseInt(e.target.parentElement.style.top) + e.movementY;
    }
  });

  title.addEventListener("mouseup", e => {
    e.target.dragging = false;
  });

  title.addEventListener("mouseleave", e => {
    e.target.dragging = false;
  });
}

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
const buttonClone = document.getElementById("clone-element");

function destroyListener() {
  selectedElement.destroyed = true;
  elements.splice(elements.indexOf(selectedElement), 1);

  clearSelection();
}

function cloneListener() {
  const cloned = Object.assign({}, selectedElement);
  cloned.__proto__ = selectedElement.__proto__;

  elements.push(cloned);
  select(cloned);
}

buttonDestroy.addEventListener("click", destroyListener);
buttonClone.addEventListener("click", cloneListener);

function select(element) {
  if(selectedElement) selectedElement.highlighted = false;
  element.highlighted = true;

  const inputsTag = document.getElementById("element-inputs");
  inputsTag.innerHTML = "";

  for(let i = 0; i < element.inputs.length; i++) {
    const buttonSelectInput = document.createElement("button");

    buttonSelectInput.innerText = `Select input #${i + 1}`;

    function selectInputListener() {
      buttonSelectInput.removeEventListener("click", selectInputListener);

      selectingInput = {element: selectedElement, index: i}
    }

    buttonSelectInput.addEventListener("click", selectInputListener);

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

const outputSelectButtons = document.getElementById("output-select-buttons");

canvas.addEventListener("mousedown", e => {
  const found = elements.filter(it => (
    (it.frameX <= e.clientX)
    && (it.frameY <= e.clientY)
    && (it.frameX + it.width > e.clientX)
    && (it.frameY + it.height > e.clientY)
  )).pop();

  if(found && found !== selectedElement) {
    if(selectingInput) {
      for(let i = 0; i < found.outputs.length; i++) {
        const button = document.createElement("button");

        button.className = "absolute-button";
        button.innerText = `Use output #${i + 1}`;

        button.style.left = found.frameX + found.width;
        button.style.top = found.frameY + (found.height / (found.outputs.length + 1) * (i + 1));

        button.addEventListener("click", () => {
          outputSelectButtons.innerHTML = "";

          selectingInput.element.inputs[selectingInput.index] = {element: found, index: i};
          selectingInput = undefined;

          dispatchEvent(updateCircuit);
        });

        outputSelectButtons.appendChild(button);
      }

      dispatchEvent(updateCircuit);
    } else {
      select(found);
      selectionMoving = true;
    }
  } else {
    selectingInput = undefined;
    clearSelection();
  }
});

canvas.addEventListener("mousemove", e => {
  if(selectedElement && selectionMoving) {
    selectedElement.ondrag({x: e.clientX, y: e.clientY});

    dispatchEvent(updateCircuit);
  }
});

canvas.addEventListener("mouseup", () => {
  if(selectionMoving) selectionMoving = false;
});

canvas.addEventListener("click", e => {
  const found = elements.filter(it => (
    (it.frameX <= e.clientX)
    && (it.frameY <= e.clientY)
    && (it.frameX + it.width > e.clientX)
    && (it.frameY + it.height > e.clientY)
  )).pop();

  if(found) {
    found.onclick(e);
  }
})