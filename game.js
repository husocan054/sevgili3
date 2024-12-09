const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameOverElement = document.getElementById("gameOver");

const playerWidth = 30;
const playerHeight = 30;
const playerSpeed = 5;
let playerY = canvas.height / 2;
let playerVelocity = 0;

const obstacleWidth = 50;
const obstacleHeight = 100;
const obstacleSpeed = 2;
let obstacles = [];

let isGameOver = false;
canvas.width = 800;
canvas.height = 600;

// Arka plan - orman
const backgroundImg = new Image();
backgroundImg.src = 'https://via.placeholder.com/800x600/228B22/FFFFFF?text=Orman'; // Orman görseli

// Karakter (oyuncu)
const player = {
    x: 50,
    y: playerY,
    width: playerWidth,
    height: playerHeight,
    color: "red",
    draw: function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Yüz çizme
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 3, 5, 0, Math.PI * 2, true); // Gözler
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 3, 0, Math.PI, false); // Ağız
        ctx.stroke();
    },
    move: function () {
        this.y += playerVelocity;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;
    }
};

// Engel (obstacle)
function createObstacle() {
    const gap = 150; // Engeller arasındaki boşluk
    const topHeight = Math.floor(Math.random() * (canvas.height - gap));
    obstacles.push({
        x: canvas.width,
        y: 0,
        width: obstacleWidth,
        height: topHeight,
        gap: gap,
        color: "green"
    });
}

// Engel hareketi
function moveObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacleSpeed;
    }
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0); // Engelleri ekran dışına taşıdıkça sil
}

// Engel çizme
function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillStyle = obstacles[i].color;
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        ctx.fillRect(obstacles[i].x, obstacles[i].y + obstacles[i].height + obstacles[i].gap, obstacles[i].width, canvas.height - obstacles[i].height - obstacles[i].gap);
    }
}

// Çarpma kontrolü
function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        if (player.x + player.width > obstacles[i].x && player.x < obstacles[i].x + obstacles[i].width) {
            if (player.y < obstacles[i].height || player.y + player.height > obstacles[i].height + obstacles[i].gap) {
                gameOver();
            }
        }
    }
}

// Oyun bitişi
function gameOver() {
    isGameOver = true;
    gameOverElement.classList.remove("hidden");
}

// Oyun başlatma
function restartGame() {
    isGameOver = false;
    player.y = canvas.height / 2;
    obstacles = [];
    gameOverElement.classList.add("hidden");
    animate();
}

// Oyun animasyonu
function animate() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Arka plan çizme
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    player.draw();
    player.move();
    moveObstacles();
    drawObstacles();
    checkCollision();

    if (Math.random() < 0.02) {
        createObstacle(); // Engeller arası rastgele bir engel yarat
    }

    requestAnimationFrame(animate);
}

// Klavye kontrolü
document.addEventListe
