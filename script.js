const scanBtn = document.getElementById('scanBtn');
const imageInput = document.getElementById('imageInput');
const output = document.getElementById('output');
const loading = document.getElementById('loading');
const progressFill = document.getElementById('progressFill');

// Cr�ation des boutons Copier et Partager
const btnContainer = document.createElement('div');
btnContainer.style.marginTop = '15px';

const copyBtn = document.createElement('button');
copyBtn.textContent = '?? Copier le texte';
copyBtn.style.marginRight = '10px';
copyBtn.style.padding = '8px 15px';

const shareBtn = document.createElement('button');
shareBtn.textContent = '?? Partager le texte';
shareBtn.style.padding = '8px 15px';

btnContainer.appendChild(copyBtn);
btnContainer.appendChild(shareBtn);

output.parentNode.insertBefore(btnContainer, output.nextSibling);

// �v�nements Copier et Partager
copyBtn.addEventListener('click', () => {
  if (output.textContent.trim().length === 0) {
    alert("Aucun texte � copier !");return;
  }
  navigator.clipboard.writeText(output.textContent).then(() => {
    alert("Texte copi� dans le presse-papier !");
  });
});

shareBtn.addEventListener('click', async () => {
  if (output.textContent.trim().length === 0) {
    alert("Aucun texte � partager !");
    return;
  }
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Texte extrait par Soft DRC',
        text: output.textContent,
      });
    } catch (err) {
      alert("Partage annul� ou erreur : " + err);
    }
  } else {
    alert("Le partage n'est pas support� sur ce navigateur.");
  }
});

scanBtn.addEventListener('click', () => {
  const file = imageInput.files[0];
  if (!file) {
    alert("Choisis une image d'abord !");
    return;
  }

  output.textContent = '';
  loading.style.display = 'block';
  progressFill.style.width = '0%';

  const reader = new FileReader();
  reader.onload = function() {
    Tesseract.recognize(
      reader.result,
      'fra',
      { 
        logger: m => {
          if (m.status === 'recognizing text') {
            const progress = Math.floor(m.progress * 100);
            progressFill.style.width = progress + '%';
          }
        }
      }
    ).then(({ data: { text } }) => {
      output.textContent = text;loading.style.display = 'none';
    }).catch(() => {
      alert("Erreur durant l'extraction.");
      loading.style.display = 'none';
    });
  }
  reader.readAsDataURL(file);
});