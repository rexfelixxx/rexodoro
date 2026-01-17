let focus_time = 25 * 60;
let break_time = 5 * 60;
let time = focus_time;
let end_date = null;
let start_date = null;
let remaining_time = null;
let interval = null;
let isFocus = true;
let storage = {
  isDarkThemeEnabled: localStorage.getItem("darkTheme"),
  endDate: localStorage.getItem("endDate")
};

console.log(storage.isDarkThemeEnabled);

let timerElement = document.getElementById("timer-id");
let modeElement = document.getElementById("mode-id");
let toggleThemeElement = document.getElementById("toggle-theme-id");
let bodyElement = document.querySelector("body");
const focusTime = document.getElementById("focus-time");
const breakTime = document.getElementById("break-time");

function updateDisplay() {
  const minutes = String(Math.floor(remaining_time / 60)).padStart(2, "0");
  const seconds = (remaining_time % 60).toFixed(0).padStart(2, "0");

  timerElement.innerText = `${minutes}:${seconds}`;
}

if(storage.endDate) start();
function start() {
  if (interval) return;

  start_date = Date.now();
  end_date = storage.endDate || Date.now() + time * 1000;
  localStorage.setItem("endDate", end_date);
  interval = setInterval(() => {
    updateDisplay();
    const time_elapsed = (end_date - Date.now()) / 1000;
    remaining_time = time_elapsed;

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
  localStorage.removeItem("endDate");
  storage.endDate = null;
  time = focus_time;
  remaining_time = time;
  modeElement.innerText = "Focus";

  updateDisplay();
  stop();
}

if (storage.isDarkThemeEnabled == "true") {
  toggleTheme()
}

function toggleTheme() {
  if (!bodyElement.classList.contains("dark")) {
    toggleThemeElement.innerText = "Dark";
    localStorage.setItem("darkTheme", "true");
  } else {
    toggleThemeElement.innerText = "Light";
    localStorage.setItem("darkTheme", "false");
  }
  document.querySelector("body").classList.toggle("dark");
}

let popup = document.querySelector(".set-popup");

function setPopUp() {
  popup.classList.toggle("hide");
}

function setTimer() {
  if (!focusTime.value || !breakTime.value) {
    alert("You need to fill both field");
    return;
  }
  focus_time = focusTime.value * 60;
  break_time = breakTime.value * 60;
  reset();
}

