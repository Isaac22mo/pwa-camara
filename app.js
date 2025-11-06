const openCameraBtn = document.getElementById('openCamera');
const switchCameraBtn = document.getElementById('switchCamera');
const clearGalleryBtn = document.getElementById('clearGallery');
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const canvas = document.getElementById('canvas');
const gallery = document.getElementById('gallery');

const ctx = canvas.getContext('2d');

let stream = null;
let facingMode = 'environment'; // Por defecto, cámara trasera
let photos = []; // Array para almacenar las fotos

async function openCamera() {
  try {
    const constraints = {
      video: {
        facingMode: { exact: facingMode },
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    };

    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

    cameraContainer.style.display = 'block';
    openCameraBtn.textContent = 'Cámara Abierta';
    openCameraBtn.disabled = true;

    console.log(`Cámara ${facingMode} abierta`);
  } catch (error) {
    console.error('Error al acceder a la cámara:', error);
    alert('No se pudo acceder a la cámara. Revisa permisos o dispositivo.');
  }
}

function takePhoto() {
  if (!stream) {
    alert('Primero debes abrir la cámara.');
    return;
  }

  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  canvas.width = videoWidth;
  canvas.height = videoHeight;

  ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
  const imageDataURL = canvas.toDataURL('image/png');

  // Guardar foto
  photos.push(imageDataURL);
  renderGallery();

  console.log('Foto capturada');
}

function renderGallery() {
  gallery.innerHTML = ''; // Limpia la galería

  // Mostrar fotos más antiguas primero
  photos.forEach((photo) => {
    const img = document.createElement('img');
    img.src = photo;
    gallery.appendChild(img);
  });
}

function switchCamera() {
  facingMode = facingMode === 'environment' ? 'user' : 'environment';
  closeCamera();
  openCamera();
}

function clearGallery() {
  photos = [];
  gallery.innerHTML = '';
}

function closeCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
    cameraContainer.style.display = 'none';
    openCameraBtn.textContent = 'Abrir Cámara';
    openCameraBtn.disabled = false;
    console.log('Cámara cerrada');
  }
}

openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);
switchCameraBtn.addEventListener('click', switchCamera);
clearGalleryBtn.addEventListener('click', clearGallery);

window.addEventListener('beforeunload', closeCamera);
