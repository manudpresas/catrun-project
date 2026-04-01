// === Cat Run - Game Script ===

const cat = document.getElementById('cat');
const container = document.getElementById('game-container');
const scoreValue = document.getElementById('score-value');
const speedFill = document.getElementById('speed-fill');
const btnJump = document.getElementById('btn-jump');
const btnSpeed = document.getElementById('btn-speed');
const btnTheme = document.getElementById('btn-theme');
const obstaclesContainer = document.getElementById('obstacles');
const particlesContainer = document.getElementById('particles');
const starsContainer = document.getElementById('stars');

let score = 0;
let isJumping = false;
let isBoosted = false;
let isNight = false;
let gameSpeed = 1;
let scoreInterval;
let obstacleInterval;
let particleInterval;

// === Initialize ===
function init() {
  createStars();
  startScoring();
  startObstacles();
  startDustParticles();
  setupControls();
}

// === Stars ===
function createStars() {
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: white;
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
      animation-delay: ${Math.random() * 3}s;
    `;
    starsContainer.appendChild(star);
  }

  // Add twinkle keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// === Score ===
function startScoring() {
  scoreInterval = setInterval(() => {
    score += isBoosted ? 3 : 1;
    scoreValue.textContent = score.toLocaleString();
  }, 100);
}

// === Jump ===
function jump() {
  if (isJumping) return;
  isJumping = true;
  cat.classList.add('jumping');

  // Create jump particles
  for (let i = 0; i < 5; i++) {
    createParticle(
      cat.offsetLeft + 30,
      container.clientHeight * 0.75,
      '#8B4513'
    );
  }

  setTimeout(() => {
    cat.classList.remove('jumping');
    setTimeout(() => { isJumping = false; }, 200);
  }, 600);
}

// === Speed Boost ===
function toggleBoost() {
  isBoosted = !isBoosted;
  cat.classList.toggle('boosted', isBoosted);
  btnSpeed.textContent = isBoosted ? '⚡ Normal' : '⚡ Boost';

  // Update speed bar
  speedFill.style.width = isBoosted ? '90%' : '50%';
  speedFill.classList.toggle('fast', isBoosted);

  // Adjust animation speeds
  document.documentElement.style.setProperty(
    '--game-speed',
    isBoosted ? '0.5' : '1'
  );

  // Speed up tree and grass animations
  document.querySelectorAll('.tree').forEach(tree => {
    tree.style.animationDuration = isBoosted ? '4s' : '8s';
  });
  document.getElementById('grass').style.animationDuration = isBoosted ? '1s' : '2s';

  // Speed up leg animations
  const legs = document.querySelectorAll('.leg');
  legs.forEach(leg => {
    leg.style.animationDuration = isBoosted ? '0.15s' : '0.3s';
  });

  // Speed up body bob
  const catBody = document.querySelector('.cat-body');
  catBody.style.animationDuration = isBoosted ? '0.15s' : '0.3s';
}

// === Theme Toggle ===
function toggleTheme() {
  isNight = !isNight;
  container.classList.toggle('night', isNight);
  btnTheme.textContent = isNight ? '☀️ Day' : '🌙 Night';
}

// === Obstacles ===
function startObstacles() {
  obstacleInterval = setInterval(() => {
    if (Math.random() > 0.5) createObstacle();
  }, 2000);
}

function createObstacle() {
  const obstacle = document.createElement('div');
  const type = Math.random() > 0.5 ? 'rock' : 'bush';
  obstacle.className = `obstacle ${type}`;
  obstacle.style.animationDuration = isBoosted ? '2s' : '4s';
  obstaclesContainer.appendChild(obstacle);

  // Remove after animation
  obstacle.addEventListener('animationend', () => obstacle.remove());
}

// === Dust Particles ===
function startDustParticles() {
  particleInterval = setInterval(() => {
    if (!isJumping) {
      createParticle(
        cat.offsetLeft + 10 + Math.random() * 20,
        container.clientHeight * 0.75 + Math.random() * 5,
        isNight ? '#555' : '#c4a76c'
      );
    }
  }, 150);
}

function createParticle(x, y, color) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  const size = Math.random() * 6 + 3;
  particle.style.cssText = `
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
  `;
  particlesContainer.appendChild(particle);
  setTimeout(() => particle.remove(), 800);
}

// === Controls ===
function setupControls() {
  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      jump();
    }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      e.preventDefault();
      if (!isBoosted) toggleBoost();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      if (isBoosted) toggleBoost();
    }
  });

  // Buttons
  btnJump.addEventListener('click', jump);
  btnSpeed.addEventListener('click', toggleBoost);
  btnTheme.addEventListener('click', toggleTheme);

  // Touch support
  container.addEventListener('touchstart', (e) => {
    if (e.target.tagName !== 'BUTTON') {
      e.preventDefault();
      jump();
    }
  });
}

// === Start ===
init();
