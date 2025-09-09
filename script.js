const scanBtn = document.getElementById('scanBtn');
const imageInput = document.getElementById('imageInput');
const output = document.getElementById('output');
const loading = document.getElementById('loading');
const progressFill = document.getElementById('progressFill');

scanBtn.addEventListener('click', () => {
  const file = imageInput.files[0];
  if (!file) {
    alert("Veuillez sélectionner une image.");
    return;
  }

  output.textContent = '';
  progressFill.style.width = '0%';
  loading.style.display = 'flex';

  const reader = new FileReader();
  reader.onload = function () {
    Tesseract.recognize(reader.result, 'fra+eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          const percent = Math.floor(m.progress * 100);
          progressFill.style.width = percent + '%';
        }
      }
    }).then(({ data: { text } }) => {
      loading.style.display = 'none';
      output.textContent = text.trim();
    }).catch(err => {
      loading.style.display = 'none';output.textContent = "Erreur lors de l'extraction du texte.";
      console.error(err);
    });
  };
  reader.readAsDataURL(file);
});

// Copier le texte
document.getElementById('copyBtn').addEventListener('click', () => {
  const text = output.textContent;
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Texte copié dans le presse-papiers !');
    });
  }
});

// Partager le texte (si supporté)
document.getElementById('shareBtn').addEventListener('click', () => {
  const text = output.textContent;
  if (navigator.share && text) {
    navigator.share({ text })
      .catch(err => console.error("Partage échoué", err));
  } else {
    alert("Le partage n'est pas supporté sur cet appareil.");
  }
});
