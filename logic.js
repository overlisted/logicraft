import {COLORS, updateCircuit, CanvasElement} from "./render.js"

class LogicElement extends CanvasElement {
  destroyed = false;

  inputs;

  highlighted;

  height = 50;
  width = 50;

  get frameX() { return this.x - this.width / 2; }
  get frameY() { return this.y - this.height / 2; }
  get imageX() { return this.x - this.image.width / 2; }
  get imageY() { return this.y - this.image.height / 2; }

  get inputValues() { return this.inputs.map(it => it.element ? it.element.outputs[it.index] : false); }

  constructor(x, y, inputs, imageLocation = null) {
    super(imageLocation);

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

      const fromPosX = input.frameX + input.width;
      const fromPosY = input.frameY + (input.height / (input.outputs.length + 1) * (connection.index + 1));

      const posX = this.frameX;
      const posY = this.frameY + (this.height / (this.inputs.length + 1) * (index + 1));

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
    if(this.image) ctx.drawImage(this.image, this.imageX, this.imageY);

    ctx.strokeStyle = this.highlighted ? COLORS.highlightMain : COLORS.black;
    ctx.strokeRect(this.frameX, this.frameY, this.width, this.height);
  }

  ondrag(e) {
    this.x = e.x;
    this.y = e.y;
  }
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
    ctx.fillRect(this.frameX, this.frameY, this.width, this.height);

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
  constructor(x, y) {
    super(x, y, new Array(1), "svg/diode.svg");
  }

  get outputs() {
    return this.inputValues;
  };
}

class NOT extends LogicElement {
  constructor(x, y) {
    super(x, y, new Array(1), "svg/not.svg");
  }

  get outputs() {
    return this.inputValues.map(it => !it);
  };
}

class OR extends LogicElement {
  constructor(x, y) {
    super(x, y, new Array(2), "svg/or.svg");
  }

  get outputs() {
    return [this.inputValues[0] | this.inputValues[1]];
  };
}

class AND extends LogicElement {
  constructor(x, y) {
    super(x, y, new Array(2), "svg/and.svg");
  }

  get outputs() {
    return [this.inputValues[0] & this.inputValues[1]];
  };
}

class XOR extends LogicElement {
  constructor(x, y) {
    super(x, y, new Array(2), "svg/xor.svg");
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
    ctx.fillRect(this.frameX, this.frameY, this.width, this.height);

    super.render(ctx);
  }
}

export {LogicElement, PlayerInput, Diode, NOT, OR, AND, XOR, Lamp};