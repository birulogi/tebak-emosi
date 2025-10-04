// Peta emosi ke Bahasa Indonesia
const emotionMap = {
  happy: "Senang 😊",
  sad: "Sedih 😢",
  angry: "Marah 😡",
  surprised: "Terkejut 😲",
  neutral: "Netral 😐",
  fear: "Takut 😱",
  disgust: "Jijik 🤢"
};

// Elemen DOM
const cameraBtn = document.getElementById("cameraBtn");
const uploadBtn = document.getElementById("uploadBtn");
const stopBtn = document.getElementById("stopBtn");
const cameraContainer = document.getElementById("cameraContainer");
const uploadContainer = document.getElementById("uploadContainer");
const resultBox = document.getElementById("result");
const imageUpload = document.getElementById("imageUpload");
const video = document.getElementById("camera");
const preview = document.getElementById("preview");

let stream;

// Tombol: gunakan kamera
cameraBtn.addEventListener("click", async () => {
  cameraContainer.classList.remove("hidden");
  uploadContainer.classList.add("hidden");
  resultBox.innerText = "";
  
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    stopBtn.disabled = false;
  } catch (err) {
    alert("Tidak dapat mengakses kamera! Pastikan izin kamera diaktifkan.");
  }
});

// Tombol: hentikan kamera
stopBtn.addEventListener("click", () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stopBtn.disabled = true;
    resultBox.innerText = "Kamera dihentikan.";
  }
});

// Tombol: unggah gambar
uploadBtn.addEventListener("click", () => {
  uploadContainer.classList.remove("hidden");
  cameraContainer.classList.add("hidden");
  resultBox.innerText = "";
});

// Ketika gambar diunggah
imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    preview.src = reader.result;
    preview.classList.remove("hidden");

    // Simulasi deteksi emosi
    const emotions = Object.values(emotionMap);
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    resultBox.innerText = `Emosi terdeteksi: ${randomEmotion}`;
  };
  reader.readAsDataURL(file);
});
