const emotionMap = {
  happy: "Senang 😊",
  sad: "Sedih 😢",
  angry: "Marah 😡",
  surprised: "Terkejut 😲",
  neutral: "Netral 😐",
  fear: "Takut 😱",
  disgust: "Jijik 🤢"
};

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
let cameraInterval;

// Muat model dari CDN
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.4.1/model/'),
  faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.4.1/model/')
]).then(() => {
  resultBox.innerText = "✅ Model siap digunakan!";
});

// ---------------------
// 📸 Mode Kamera
// ---------------------
cameraBtn.addEventListener("click", async () => {
  cameraContainer.classList.remove("hidden");
  uploadContainer.classList.add("hidden");
  resultBox.innerText = "Mengaktifkan kamera...";

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    stopBtn.disabled = false;

    cameraInterval = setInterval(async () => {
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections && detections.expressions) {
        const maxEmotion = Object.entries(detections.expressions)
          .reduce((a, b) => (a[1] > b[1] ? a : b))[0];
        resultBox.innerText = `Emosi terdeteksi: ${emotionMap[maxEmotion] || maxEmotion}`;
      } else {
        resultBox.innerText = "Tidak ada wajah terdeteksi 😶";
      }
    }, 2000);
  } catch (err) {
    alert("Tidak dapat mengakses kamera! Pastikan izin kamera diaktifkan dan gunakan HTTPS/localhost.");
  }
});

// Hentikan Kamera
stopBtn.addEventListener("click", () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stopBtn.disabled = true;
    clearInterval(cameraInterval);
    resultBox.innerText = "Kamera dihentikan.";
  }
});

// ---------------------
// 🖼️ Mode Upload Gambar
// ---------------------
uploadBtn.addEventListener("click", () => {
  uploadContainer.classList.remove("hidden");
  cameraContainer.classList.add("hidden");
  resultBox.innerText = "Unggah foto untuk mendeteksi emosi.";
});

imageUpload.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    preview.src = reader.result;
    preview.classList.remove("hidden");
    resultBox.innerText = "Menganalisis emosi...";

    const img = await faceapi.bufferToImage(file);
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detection && detection.expressions) {
      const maxEmotion = Object.entries(detection.expressions)
        .reduce((a, b) => (a[1] > b[1] ? a : b))[0];
      resultBox.innerText = `Emosi terdeteksi: ${emotionMap[maxEmotion] || maxEmotion}`;
    } else {
      resultBox.innerText = "Tidak ada wajah terdeteksi 😶";
    }
  };
  reader.readAsDataURL(file);
});
