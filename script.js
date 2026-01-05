let focus_time = 5;
let break_time = 5;
let time = focus_time;
let end_date = null;
let start_date = null;
let remaining_time = null;
let interval = null;
let isFocus = true;

let timerElement = document.getElementById("timer-id");
let modeElement = document.getElementById("mode-id");
let toggleThemeElement = document.getElementById("toggle-theme-id");
let bodyElement = document.querySelector("body")

function updateDisplay() {
  const minutes = String(Math.floor(remaining_time / 60)).padStart(2, "0");
  const seconds = String(Math.round(remaining_time % 60)).padStart(2, "0");

  timerElement.innerText = `${minutes}:${seconds}`;
}

function start() {
  if (interval) return;

  start_date = Date.now();
  end_date = Date.now() + time * 1000;

  interval = setInterval(() => {
    updateDisplay();
    const time_elapsed = (Date.now() - start_date) / 1000;
    remaining_time = time - time_elapsed;

    if (remaining_time <= 0) {
      start_date = Date.now();
      if (!isFocus) {
        modeElement.innerText = "Focus";
        time = focus_time;
        remaining_time = focus_time;
      } else {
        modeElement.innerText = "Break";
        time = break_time;
        remaining_time = break_time;
      }
      isFocus = !isFocus;
    }
  }, 100);
}

function stop() {
  time = remaining_time;
  clearInterval(interval);
  interval = null;
}

function reset() {
  time = focus_time;
  remaining_time = time;
  modeElement.innerText = "Focus";

  updateDisplay();
  stop();
}

function toggleTheme() {
  console.log(bodyElement.classList.contains("dark"))
  if (!bodyElement.classList.contains("dark")) {
    toggleThemeElement.innerText = "Dark";
  } else {
    toggleThemeElement.innerText = "Light";
  }

  document.querySelector("body").classList.toggle("dark");
}

