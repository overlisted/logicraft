const COLORS = {
  black: "black",
  high: "gold",
  low: "gray",
  highlightMain: "lightblue"
}

const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");

const updateCircuit = new Event("circuitUpdate");

const elements = [];

addEventListener("circuitUpdate", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  elements.forEach(it => {
    it.renderWires(ctx);
    it.render(ctx);
  });
});

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  dispatchEvent(updateCircuit);
};

window.onresize(null);

export class CanvasElement {
  x;
  y;

  get imageX() {
    return this.x;
  }

  get imageY() {
    return this.y;
  }

  height;
  width;

  constructor(imageLocation) {
    if(imageLocation) {
      this.image = new Image();
      this.image.src = imageLocation;
      this.image.onload = () => dispatchEvent(updateCircuit);
    }
  }

  render(context) {};

  onclick(event) {};
  ondrag(event) {};
  onmouseenter(event) {};
  onmouseleave(event) {};
  onmousedown(event) {};
  onmouseup(event) {};
}

export {elements, canvas, updateCircuit, COLORS}