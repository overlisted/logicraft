import * as logic from "./logic.js"
import {elements, updateCircuit} from "./render.js"

elements.push(new logic.PlayerInput(90, 460));
elements.push(new logic.PlayerInput(90, 500));
elements.push(new logic.XOR(190, 400, elements[0], elements[1]));
elements.push(new logic.PlayerInput(90, 540));
elements.push(new logic.PlayerInput(90, 580));
elements.push(new logic.AND(190, 350, elements[3], elements[4]));
elements.push(new logic.AND(260, 370, elements[5], elements[2]));
elements.push(new logic.OR(320, 320, elements[6], elements[2]));
elements.push(new logic.NOT(380, 320, elements[7]));
elements.push(new logic.Lamp(430, 420, elements[8]));

dispatchEvent(updateCircuit);

window.addEventListener("keydown", e => {
  if(e.code === "Digit1") elements[0].invert();
  if(e.code === "Digit2") elements[1].invert();
  if(e.code === "Digit3") elements[3].invert();
  if(e.code === "Digit4") elements[4].invert();

  dispatchEvent(updateCircuit);
});