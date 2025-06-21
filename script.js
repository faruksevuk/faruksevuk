const profileImage = document.getElementById('profileImage');
let audio;

// Double-click detection
let clickCount = 0;
let clickTimer = null;

profileImage.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 2) {
        audio = new Audio('sounds/matrix.mp3');
        audio.loop = false;
        audio.play();

        startMatrix();
        setTimeout(() => {
            stopMatrix("You found the treasure! It's me, hehe :)");
        }, 5200);
        clickCount = 0;
        clearTimeout(clickTimer);
        clickTimer = null;
    } else {
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 400); // 400ms window for double click
    }
});

function startMatrix() {
    // Matrix efekti için gerekli div'i oluştur
    const matrixDiv = document.createElement('div');
    matrixDiv.id = 'matrix';
    document.body.appendChild(matrixDiv);

    // Matrix efekti kodları buraya (aşağıdaki örnek veya istediğiniz bir efekt)
    const canvas = document.createElement('canvas');
    matrixDiv.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext('2d');

    const katakana = 'アァカサタナハマヤャラワガザダバパ';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';

    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function draw() {
        context.fillStyle = 'rgba(0, 0, 0, 0.05)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = '#0F0';
        context.font = fontSize + 'px arial';

        for (let i = 0; i < drops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            context.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    const intervalId = setInterval(draw, 33);
    matrixDiv.intervalId = intervalId; // intervalId'yi matrixDiv'e ekle
}

function stopMatrix(message) {
    const matrixDiv = document.getElementById('matrix');
    if (matrixDiv) {
        clearInterval(matrixDiv.intervalId); // interval'i temizle

        const canvas = matrixDiv.querySelector('canvas');
        const context = canvas.getContext('2d');
        
        context.fillStyle = 'red';
        context.font = '60px Griffy';
        context.textAlign = 'center';
        context.fillText(message, canvas.width / 2, canvas.height / 2);

        setTimeout(() => {
            matrixDiv.remove(); // Matrix div'ini kaldır
            if (audio) {
                audio.pause(); // Müziği durdur
                audio.currentTime = 0; // Müziği başa sar
            }
        }, 3300);
    }
}

// mouse tracker
let lastTime = 0;
document.addEventListener("mousemove", function (e) {
  const now = Date.now();
  if (now - lastTime < 90) return; // 100ms delay → daha az iz
  lastTime = now;

  const particle = document.createElement("div");
  particle.className = "particle";
  document.body.appendChild(particle);

  const size = Math.random() * 4 + 6; // daha büyük ve canlı
  particle.style.left = e.pageX - size / 2 + "px";
  particle.style.top = e.pageY - size / 2 + "px";
  particle.style.width = size + "px";
  particle.style.height = size + "px";

  const rotate = Math.random() * 360;
  particle.style.transform = `rotate(${rotate}deg)`;

  setTimeout(() => {
    particle.remove();
  }, 1300); // daha uzun ömür
});
