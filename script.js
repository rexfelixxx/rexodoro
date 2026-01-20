// TODO: Tidying up this buffy chunky lines of code 
/**
 * Modern Pomodoro Timer
 * Refactored & Upgraded
 */

class PomodoroTimer {
  constructor() {
    // Konfigurasi Default (dalam detik)
    this.defaultFocusTime = 25 * 60;
    this.defaultBreakTime = 5 * 60;

    // State Awal
    this.currentTime = this.defaultFocusTime;
    this.remainingTime = this.defaultFocusTime;
    this.isFocusMode = true;
    this.intervalId = null;
    this.endDate = null;

    // Cache DOM Elements (Mengambil elemen HTML sekali saja)
    this.elements = {
      timer: document.getElementById("timer-id"),
      mode: document.getElementById("mode-id"),
      body: document.querySelector("body"),
      toggleThemeBtn: document.getElementById("toggle-theme-id"),
      focusInput: document.getElementById("focus-time"),
      breakInput: document.getElementById("break-time"),
      popup: document.querySelector(".set-popup"),
    };

    // Inisialisasi
    this.loadSettings();
    this.initEventListeners();
    this.updateDisplay();

    // Cek apakah ada timer berjalan yang tersimpan
    if (localStorage.getItem("endDate")) {
      this.resumeFromStorage();
    }
  }

  // --- Logic Timer ---

  start() {
    if (this.intervalId) return; // Mencegah multiple interval

    // Jika endDate null (baru mulai), hitung target waktu baru
    // Jika tidak null (resume), gunakan logika yang ada
    if (!this.endDate) {
      this.endDate = Date.now() + this.remainingTime * 1000;
      localStorage.setItem("endDate", this.endDate);
    }

    this.intervalId = setInterval(() => {
      this.tick();
    }, 100); // 100ms agar responsif
  }

  tick() {
    const now = Date.now();
    const distance = this.endDate - now;

    this.remainingTime = distance / 1000;

    if (this.remainingTime <= 0) {
      this.switchMode();
    } else {
      this.updateDisplay();
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      // Saat stop, kita hapus endDate dari storage agar tidak auto-start saat reload
      // tapi kita simpan sisa waktu di memori
      localStorage.removeItem("endDate");
      this.endDate = null;
      // remainingTime sudah terupdate di fungsi tick() terakhir
    }
  }

  reset() {
    this.stop();
    this.isFocusMode = true;
    this.currentTime = this.defaultFocusTime;
    this.remainingTime = this.defaultFocusTime;
    this.elements.mode.innerText = "Focus";
    this.updateDisplay();
  }

  switchMode() {
    // Ganti Mode (Focus <-> Break)
    this.isFocusMode = !this.isFocusMode;
    
    if (this.isFocusMode) {
      this.currentTime = this.defaultFocusTime;
      this.elements.mode.innerText = "Focus";
    } else {
      this.currentTime = this.defaultBreakTime;
      this.elements.mode.innerText = "Break";
    }

    // Reset waktu untuk mode baru
    this.remainingTime = this.currentTime;
    this.endDate = Date.now() + this.remainingTime * 1000;
    localStorage.setItem("endDate", this.endDate);
    
    // Opsional: Bunyikan alarm di sini
    this.updateDisplay();
  }

  resumeFromStorage() {
    const savedEndDate = localStorage.getItem("endDate");
    if (savedEndDate) {
      this.endDate = parseInt(savedEndDate);
      // Hitung sisa waktu saat ini
      const distance = this.endDate - Date.now();
      
      if (distance > 0) {
        this.remainingTime = distance / 1000;
        this.start(); // Lanjutkan timer otomatis
      } else {
        // Jika waktu sudah habis saat browser tutup
        localStorage.removeItem("endDate");
        this.reset();
      }
    }
  }

  setCustomTime() {
    const focusVal = this.elements.focusInput.value;
    const breakVal = this.elements.breakInput.value;

    if (!focusVal || !breakVal) {
      alert("Please fill both fields!");
      return;
    }

    this.defaultFocusTime = focusVal * 60;
    this.defaultBreakTime = breakVal * 60;
    
    this.togglePopup(); // Tutup popup
    this.reset(); // Reset dengan waktu baru
  }

  // --- Logic UI & Helper ---

  updateDisplay() {
    // Mencegah angka negatif
    let time = Math.max(0, this.remainingTime);
    
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(Math.floor(time % 60)).padStart(2, "0");
    
    this.elements.timer.innerText = `${minutes}:${seconds}`;
    
    // Update Title Browser (Fitur tambahan: biar kelihatan di tab)
    document.title = `${minutes}:${seconds} - ${this.isFocusMode ? 'Focus' : 'Break'}`;
  }

  togglePopup() {
    this.elements.popup.classList.toggle("hide");
  }

  // --- Logic Tema ---

  toggleTheme() {
    const isDark = this.elements.body.classList.toggle("dark");
    this.elements.toggleThemeBtn.innerText = isDark ? "Light" : "Dark";
    localStorage.setItem("darkTheme", isDark);
  }

  loadSettings() {
    // Load Tema
    const isDark = localStorage.getItem("darkTheme") === "true";
    if (isDark) {
      this.elements.body.classList.add("dark");
      this.elements.toggleThemeBtn.innerText = "Light"; // Tombol menunjukkan aksi selanjutnya (ke Light)
    } else {
        this.elements.toggleThemeBtn.innerText = "Dark";
    }
  }

  // Setup Event Listeners agar HTML lebih bersih
  initEventListeners() {
    // Kita asumsikan tombol di HTML memanggil fungsi global, 
    // tapi lebih baik menggunakan addEventListener jika kamu punya ID untuk tombol start/stop/reset.
    
    // Untuk kompatibilitas dengan HTML lamamu, kita expose method ke window
    // (Agar tombol onclick="start()" di HTML tetap jalan)
    window.start = () => this.start();
    window.stop = () => this.stop();
    window.reset = () => this.reset();
    window.toggleTheme = () => this.toggleTheme();
    window.setPopUp = () => this.togglePopup();
    window.setTimer = () => this.setCustomTime();
  }
}

// Jalankan Aplikasi
const app = new PomodoroTimer();
