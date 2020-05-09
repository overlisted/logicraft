import {COLORS} from "./render.js"

class LogicElement {
  inputFrom;
  x;
  y;
  outputOffset = [0, 0];
  inputOffsets = [];
  image;
  svgLocation;
  get imagePosition() {
    return [this.x - this.image.width / 2, this.y - this.image.height / 2];
  }

  constructor(x, y, ...inputFrom) {
    this.inputFrom = inputFrom;
    this.x = x;
    this.y = y;

    if(this.inputOffsets.length === 0) for(let i = 0; i < inputFrom.length; i++) this.inputOffsets[i] = [0, 0];
  }

  renderWires(ctx) {
    for(const [index, connection] of this.inputFrom.entries()) {
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
    if(this.svgLocation) {
      if(!this.image) {
        this.image = new Image();
        this.image.src = this.svgLocation;

        this.image.onload = () => ctx.drawImage(this.image, this.imagePosition[0], this.imagePosition[1]);
      } else ctx.drawImage(this.image, this.imagePosition[0], this.imagePosition[1]);
    }
  }
}

class PlayerInput extends LogicElement {
  output = false;
  outputOffset = [15, 0];

  constructor(x, y) {
    super(x, y, undefined);
  }

  invert() {
    this.output = !this.output;
  }

  render(ctx) {
    ctx.fillStyle = this.output ? COLORS.high : COLORS.low;
    ctx.fillRect(this.x - 15, this.y - 15, 30, 30);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
  }

  renderWires(ctx) {}
}

class Diode extends LogicElement {
  outputOffset = [23, 0];
  inputOffsets = [[-22, 0]];

  svgLocation = "svg/diode.svg"

  get output() {
    return this.inputFrom[0].output;
  };
}

class NOT extends LogicElement {
  outputOffset = [31, 0];
  inputOffsets = [[-22, 0]];

  svgLocation = "svg/not.svg"

  get output() {
    return !this.inputFrom[0].output;
  };
}

class OR extends LogicElement {
  outputOffset = [20, 0];
  inputOffsets = [[-18, -3], [-18, 3]];

  svgLocation = "svg/or.svg"

  get output() {
    for(const it of this.inputFrom) if(it.output) return true;
    return false;
  };
}

class AND extends LogicElement {
  outputOffset = [20, 0];
  inputOffsets = [[-18, -7], [-18, 7]];

  svgLocation = "svg/and.svg"

  get output() {
    for(const it of this.inputFrom) if(!it.output) return false;
    return true;
  };
}

class XOR extends LogicElement {
  outputOffset = [20, 0];
  inputOffsets = [[-18, -3], [-18, 3]];

  svgLocation = "svg/xor.svg"

  get output() {
    let highBits = 0;
    for(const it of this.inputFrom) if(it.output) highBits++;

    return highBits === 1;
  };
}

class Lamp extends LogicElement {
  inputOffsets = [[-15, 0]];

  get isLit() {
    return this.inputFrom[0].output;
  }

  render(ctx) {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(this.x - 15, this.y - 15, 30, 30);
    ctx.fillStyle = this.isLit ? COLORS.high : COLORS.low;
    ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
  }
}

export {LogicElement, PlayerInput, Diode, NOT, OR, AND, XOR, Lamp};