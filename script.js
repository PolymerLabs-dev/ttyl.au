const html = document.querySelector("html");
const blocker = document.querySelector("#blocker");

const bgBHueShift = 45;
const bgCLightnessShift = 5;

let hueTicker = 260;

const start = () => {
  blocker.setAttribute("loaded", "true");
};
const update = () => {
  hueTicker = (hueTicker + 1) % 360;
  const hA = hueTicker;
  const hB = hueTicker + bgBHueShift;

  let bgColorA = `hsl(${hA}deg var(--bg-s) var(--bg-l))`;
  let bgColorB = `hsl(${hB}deg var(--bg-s) var(--bg-l))`;
  let bgColorC = `hsl(${hA} var(--bg-s) calc(var(--bg-l) - ${bgCLightnessShift}))`;

  let transitionalColor = `hsl(${hA}deg var(--title-s) var(--title-l))`;

  html.style.setProperty("--background-color-a", `${bgColorA}`);
  html.style.setProperty("--background-color-b", `${bgColorB}`);
  html.style.setProperty("--background-color-c", `${bgColorC}`);

  html.style.setProperty("--background-gradient", `
    radial-gradient(ellipse at right, ${bgColorA}, transparent),
    radial-gradient(ellipse at top, ${bgColorB}, transparent),
    ${bgColorC}
  `);

  html.style.setProperty("--transitional-color", `${transitionalColor}`);
};

class EyeController {
  minBlinkInterval = 2000;
  maxBlinkInterval = 10000;
  blinkTime = 150;
  eyeElement = null;
  inactiveTime = 5000;
  mouseLookPupilSpeed = 20;
  minWanderInterval = 1000;
  maxWanderInterval = 4000;
  maxWanderDistance = 20;
  wanderPupilSpeed = 250;
  wanderTimeout = -1;
  inactiveTimeout = -1;

  wander() {
    const centre = this.getEyeCenter();

    const r1 = (Math.random() * 2) - 1;
    const r2 = (Math.random() * 2) - 1;
    const rX = centre.x + (r1 * this.maxWanderDistance);
    const rY = centre.y + (r2 * this.maxWanderDistance);

    this.lookAt(rX, rY, this.wanderPupilSpeed);
  }

  lookAt(x, y, speed) {
    this.setPupilSpeed(speed);
    const centre = this.getEyeCenter();

    const dX = x - centre.x;
    const dY = y - centre.y;

    const d = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    const closestDistance = 7;

    const nX = dX / Math.max(d, closestDistance);
    const nY = dY / Math.max(d, closestDistance);

    this.eyeElement.style.setProperty("--eye-x", `${nX}`);
    this.eyeElement.style.setProperty("--eye-y", `${nY}`);
  }

  getEyeCenter() {
    const eyeRect = this.eyeElement.getBoundingClientRect();
    const eyeCentreY = eyeRect.y + (eyeRect.height / 2);
    const eyeCentreX = eyeRect.x + (eyeRect.width / 2);

    return {x: eyeCentreX, y: eyeCentreY};
  }

  blink() {
    this.blinkTrigger();
    this.blinkAction(0);

    setTimeout(this.restorePupil.bind(this), this.blinkTime);
  }

  restorePupil() {
    this.blinkAction(1);
  }

  blinkAction(value) {
    this.eyeElement.style.setProperty("--eye-height", `${value}`);
  }

  setPupilSpeed(speed) {
    this.eyeElement.style.setProperty("--eye-pupil-movement-speed", `${speed}ms`);
  }

  blinkTrigger() {
    const timeout = (Math.random() * (this.maxBlinkInterval - this.minBlinkInterval)) + this.minBlinkInterval;
    setTimeout(this.blink.bind(this), timeout);
  }

  moveEvent(e) {
    this.lookAt(e.pageX, e.pageY, this.mouseLookPupilSpeed);

    if (this.wanderTimeout !== -1) {
      clearTimeout(this.wanderTimeout);
    }

    if (this.inactiveTimeout !== -1) {
      clearInterval(this.inactiveTimeout);
    }

    this.inactiveTimeout = setTimeout(this.setInactive.bind(this), this.inactiveTime);
  }

  setInactive() {
    const timeout = (Math.random() * (this.maxWanderInterval - this.minWanderInterval)) + this.minWanderInterval;
    this.wanderTimeout = setTimeout(this.wander.bind(this), timeout);
  }

  init() {
    this.eyeElement = document.querySelector("#eye");

    if (this.eyeElement == null) {
      throw `EyeController.init(): failed to find eye element!`;
    }
    this.restorePupil();
    this.blinkTrigger();

    setInterval(this.wander.bind(this), this.inactiveTime);
    document.addEventListener("mousemove", this.moveEvent.bind(this));
  }
}

(() => {
  start();
  setInterval(update, 1000 / 10);
  const e = new EyeController();
  e.init();
})();
