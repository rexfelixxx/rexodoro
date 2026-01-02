let focus_time = 25 * 60;
let break_time = 5 * 60;
let time = focus_time;
let remaining_time = time;
let interval = null;
let isFocus = true;

let timerElement = document.getElementById("timer-id");
let modeElement = document.getElementById("mode-id");

function updateDisplay() {
  const minutes = String(Math.floor(remaining_time / 60)).padStart(2, "0");
  const seconds = String(remaining_time % 60).padStart(2, "0");

  timerElement.innerText = `${minutes}:${seconds}`;
}

function start() {
  if (interval) return;

  let start_date = Date.now();

  interval = setInterval(() => {
    const current_date = Date.now();
    const elapsed_sec = Math.floor((current_date - start_date) / 1000);

    remaining_time = time - elapsed_sec;
    updateDisplay();

    if (remaining_time <= 0) {
      if (!isFocus) {
        modeElement.innerText = "Focus";
        time = focus_time;
        remaining_time = focus_time;
        start_date = Date.now();
      } else {
        modeElement.innerText = "Break";
        time = break_time;
        remaining_time = break_time;
        start_date = Date.now();
      }
      isFocus = !isFocus;
    }
  }, 1000);
}

function stop() {
  time = remaining_time;
  clearInterval(interval);
  date_start = null;
  interval = null;
}

function reset() {
  time = focus_time;
  remaining_time = time;
  modeElement.innerText = "Focus";

  updateDisplay();
  stop();
}

