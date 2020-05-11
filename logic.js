import {COLORS} from "./render.js"
import {updateCircuit} from "./render.js";

class LogicElement {
  destroyed = false;
  inputFrom;
  x;
  y;
  outputOffset = [0, 0];
  inputOffsets = [];
  highlighted;
  image = new Image();
  svgLocation;
  get imagePosition() {
    return [this.x - this.image.width / 2, this.y - this.image.height / 2];
  }

  constructor(inputsCount, x, y, inputFrom) {
    if(inputFrom && inputFrom.length) {
      this.inputFrom = inputFrom;
    } else {
      this.inputFrom = new Array(inputsCount);
    }

    this.x = x;
    this.y = y;

    if(this.inputOffsets.length === 0) for(let i = 0; i < inputsCount; i++) this.inputOffsets[i] = [0, 0];
  }

  renderWires(ctx) {
    for(let [index, connection] of this.inputFrom.entries()) {
      if(!connection) continue;
      if(connection.destroyed) {
        connection = undefined;
        continue;
      }

      ctx.beginPath();
      ctx.strokeStyle = connection.output ? COLORS.high : COLORS.low;
      ctx.moveTo(this.x + this.inputOffsets[index][0], this.y + this.inputOffsets[index][1]);

      const betweenPosX = (this.x - connection.x) / 3;
      ctx.bezierCurveTo(
        this.x - betweenPosX + this.inputOffsets[index][0],
        this.y + this.inputOffsets[index][1],
        connection.x + betweenPosX + connection.outputOffset[0],
        connection.y - connection.outputOffset[1],
        connection.x + connection.outputOffset[0],
        connection.y + connection.outputOffset[1]
      );

      ctx.stroke();
    }
  }

  render(ctx) {
    if(!this.image.src && this.svgLocation) {
      this.image.src = this.svgLocation;

      this.image.onload = () => ctx.drawImage(this.image, this.imagePosition[0], this.imagePosition[1]);
    } else ctx.drawImage(this.image, this.imagePosition[0], this.imagePosition[1]);

    if(this.highlighted) {
      ctx.strokeStyle = COLORS.highlightMain;
      ctx.strokeRect(this.imagePosition[0], this.imagePosition[1], this.image.width, this.image.height);
    }
  }

  onclick(e) {}
}

class PlayerInput extends LogicElement {
  output = false;
  outputOffset = [15, 0];
  image = new Image(30, 30);

  constructor(x, y) {
    super(0, x, y, undefined);
  }

  toggle() {
    this.output = !this.output;
  }

  render(ctx) {
    ctx.fillStyle = this.output ? COLORS.high : COLORS.low;
    ctx.fillRect(this.x - 15, this.y - 15, 30, 30);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(this.x - 10, this.y - 10, 20, 20);

    super.render(ctx);
  }

  renderWires(ctx) {}

  onclick(e) {
    if(e.ctrlKey && e.button === 0) {
      this.toggle();
      dispatchEvent(updateCircuit);
    }
  }
}

class Diode extends LogicElement {
  outputOffset = [23, 0];
  inputOffsets = [[-22, 0]];

  svgLocation = "svg/diode.svg"

  constructor(x, y, ...inputFrom) {
    super(1, x, y, inputFrom);
  }

  get output() {
    if(this.inputFrom.includes(undefined)) return false;

    return this.inputFrom[0].output;
  };
}

class NOT extends LogicElement {
  outputOffset = [31, 0];
  inputOffsets = [[-22, 0]];

  svgLocation = "svg/not.svg"

  constructor(x, y, ...inputFrom) {
    super(1, x, y, inputFrom);
  }

  get output() {
    if(this.inputFrom.includes(undefined)) return false;

    return !this.inputFrom[0].output;
  };
}

class OR extends LogicElement {
  outputOffset = [20, 0];
  inputOffsets = [[-18, -3], [-18, 3]];

  svgLocation = "svg/or.svg"

  constructor(x, y, ...inputFrom) {
    super(2, x, y, inputFrom);
  }

  get output() {
    if(this.inputFrom.includes(undefined)) return false;

    return this.inputFrom[0].output | this.inputFrom[1].output;
  };
}

class AND extends LogicElement {
  outputOffset = [20, 0];
  inputOffsets = [[-18, -7], [-18, 7]];

  svgLocation = "svg/and.svg"

  constructor(x, y, ...inputFrom) {
    super(2, x, y, inputFrom);
  }

  get output() {
    if(this.inputFrom.includes(undefined)) return false;

    return this.inputFrom[0].output & this.inputFrom[1].output;
  };
}

class XOR extends LogicElement {
  outputOffset = [20, 0];
  inputOffsets = [[-18, -3], [-18, 3]];

  svgLocation = "svg/xor.svg"

  constructor(x, y, ...inputFrom) {
    super(2, x, y, inputFrom);
  }

  get output() {
    if(this.inputFrom.includes(undefined)) return false;

    return this.inputFrom[0].output ^ this.inputFrom[1].output;
  };
}

class Lamp extends LogicElement {
  inputOffsets = [[-15, 0]];
  image = new Image(30, 30);

  get isLit() {
    if(this.inputFrom.includes(undefined)) return false;

    return this.inputFrom[0].output;
  }

  constructor(x, y, ...inputFrom) {
    super(1, x, y, inputFrom);
  }

  render(ctx) {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(this.x - 15, this.y - 15, 30, 30);
    ctx.fillStyle = this.isLit ? COLORS.high : COLORS.low;
    ctx.fillRect(this.x - 10, this.y - 10, 20, 20);

    super.render(ctx);
  }
}

export {LogicElement, PlayerInput, Diode, NOT, OR, AND, XOR, Lamp};