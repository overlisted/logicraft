import {COLORS} from "./render.js"
import {updateCircuit} from "./render.js";
import {elements} from "./render.js";

class LogicElement {
  destroyed = false;

  inputs;

  x;
  y;

  highlighted;

  svgLocation;
  height = 50;
  width = 50;
  image = new Image();

  get framePosX() { return this.x - this.width / 2; }
  get framePosY() { return this.y - this.height / 2; }
  get imagePosX() { return this.x - this.image.width / 2; }
  get imagePosY() { return this.y - this.image.height / 2; }

  get inputValues() { return this.inputs.map(it => it.element ? it.element.outputs[it.index] : false); }

  constructor(x, y, inputs = []) {
    this.inputs = inputs;

    this.x = x;
    this.y = y;
  }

  renderWires(ctx) {
    for(let [index, connection] of this.inputs.entries()) {
      if(!connection || !connection.element) continue;
      if(connection.element.destroyed) {
        connection = undefined;
        continue;
      }

      const input = connection.element;

      const fromPosX = input.framePosX + input.width;
      const fromPosY = input.y;

      const posX = this.framePosX;
      const posY = this.framePosY + (this.height / (this.inputs.length + 1) * (index + 1));

      ctx.beginPath();
      ctx.strokeStyle = input.outputs[connection.index] ? COLORS.high : COLORS.low;

      ctx.moveTo(posX, posY);

      const betweenPosX = (this.x - input.x) / 3;
      ctx.bezierCurveTo(
        posX - betweenPosX,
        posY,
        fromPosX + betweenPosX,
        fromPosY,
        fromPosX,
        fromPosY
      );

      ctx.stroke();
    }
  }

  render(ctx) {
    ctx.strokeStyle = this.highlighted ? COLORS.highlightMain : COLORS.black;
    ctx.strokeRect(this.framePosX, this.framePosY, this.width, this.height);

    if(!this.image.src && this.svgLocation) {
      this.image.src = this.svgLocation;

      this.image.onload = () => ctx.drawImage(this.image, this.imagePosX, this.imagePosY);
    } else ctx.drawImage(this.image, this.imagePosX, this.imagePosY);
  }

  onclick(e) {}
}

class PlayerInput extends LogicElement {
  width = 20;
  height = 20;

  outputs = [false];

  constructor(x, y) {
    super(x, y, []);
  }

  render(ctx) {
    ctx.fillStyle = this.outputs[0] ? COLORS.high : COLORS.low;
    ctx.fillRect(this.framePosX, this.framePosY, this.width, this.height);

    super.render(ctx);
  }

  onclick(e) {
    if(e.ctrlKey && e.button === 0) {
      this.outputs[0] = !this.outputs[0];
      dispatchEvent(updateCircuit);
    }
  }
}

class Diode extends LogicElement {
  svgLocation = "svg/diode.svg"

  constructor(x, y) {
    super(x, y, new Array(1));
  }

  get outputs() {
    return this.inputValues;
  };
}

class NOT extends LogicElement {
  svgLocation = "svg/not.svg"

  constructor(x, y) {
    super(x, y, new Array(1));
  }

  get outputs() {
    return this.inputValues.map(it => !it);
  };
}

class OR extends LogicElement {
  svgLocation = "svg/or.svg"

  constructor(x, y) {
    super(x, y, new Array(2));
  }

  get outputs() {
    return [this.inputValues[0] | this.inputValues[1]];
  };
}

class AND extends LogicElement {
  svgLocation = "svg/and.svg"

  constructor(x, y) {
    super(x, y, new Array(2));
  }

  get outputs() {
    return [this.inputValues[0] & this.inputValues[1]];
  };
}

class XOR extends LogicElement {
  svgLocation = "svg/xor.svg"

  constructor(x, y) {
    super(x, y, new Array(2));
  }

  get outputs() {
    return [this.inputValues[0] ^ this.inputValues[1]];
  };
}

class Lamp extends LogicElement {
  width = 30;
  height = 30;

  constructor(x, y) {
    super(x, y, new Array(1));
  }

  get outputs() {
    return this.inputValues;
  }

  render(ctx) {
    ctx.fillStyle = this.outputs[0] ? COLORS.high : COLORS.low;
    ctx.fillRect(this.framePosX, this.framePosY, this.width, this.height);

    super.render(ctx);
  }
}

elements.push(new PlayerInput(500, 500));
elements.push(new PlayerInput(500, 600));
elements.push(new XOR(550, 550));
elements.push(new Lamp(650, 500));

elements[2].inputs = [{element: elements[0], index: 0}, {element: elements[1], index: 0}]
elements[3].inputs = [{element: elements[2], index: 0}];

export {LogicElement, PlayerInput, Diode, NOT, OR, AND, XOR, Lamp};