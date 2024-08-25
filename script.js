
const html = document.querySelector("html");
const blocker = document.querySelector("#blocker");
const date = document.querySelector("#date");

const bgBHueShift = 45;
const bgCLightnessShift = 5;

let hueTicker = 260;

const start = () => {
  blocker.setAttribute("loaded", "true");
}
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
}

(() => {
  start();
  setInterval(update, 1000 / 10);
})();
