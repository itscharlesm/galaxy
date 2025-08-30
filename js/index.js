
let highestZ = 10;
let currentIndex = 0;
let musicEnabled = false;

const starCards = Array.from(document.querySelectorAll('.star-card'));
const progressIndicator = document.querySelector('.progress-indicator');

// Create progress dots
starCards.forEach((_, index) => {
  const dot = document.createElement('div');
  dot.className = 'progress-dot';
  if (index === 0) dot.classList.add('active');
  progressIndicator.appendChild(dot);
});

const progressDots = Array.from(document.querySelectorAll('.progress-dot'));

// Hide all cards except first
starCards.forEach((card, index) => {
  if (index !== 0) {
    card.style.display = 'none';
  } else {
    animateParagraphsSequentially(card);
  }
});

function animateParagraphsSequentially(card) {
  const paragraphs = card.querySelectorAll('p');
  let current = 0;

  function showNext() {
    if (current < paragraphs.length) {
      const p = paragraphs[current];
      p.style.display = 'block';
      p.classList.remove('animate-type');
      void p.offsetWidth;
      p.classList.add('animate-type');

      setTimeout(() => {
        current++;
        showNext();
      }, 3000);
    } else {
      const img = card.querySelector('img');
      if (img) {
        img.style.display = 'block';
        img.style.animation = 'glow-pulse 3s ease-in-out infinite';
      }
    }
  }

  paragraphs.forEach(p => p.style.display = 'none');
  const img = card.querySelector('img');
  if (img) img.style.display = 'none';

  showNext();
}

class StarCard {
  constructor(card, index) {
    this.card = card;
    this.index = index;
    this.holding = false;
    this.hasMoved = false;
    this.initialDistance = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.rotation = Math.random() * 10 - 5;
    this.init();
  }

  init() {
    this.card.addEventListener('mousedown', (e) => this.startDrag(e));
    this.card.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));

    document.addEventListener('mousemove', (e) => this.handleMove(e));
    document.addEventListener('touchmove', (e) => this.handleMove(e.touches[0]));

    document.addEventListener('mouseup', () => this.endDrag());
    document.addEventListener('touchend', () => this.endDrag());
  }

  startDrag(e) {
    if (this.holding) return;

    this.holding = true;
    this.hasMoved = false;
    this.card.style.zIndex = highestZ++;

    const rect = this.card.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;
    this.initialDistance = 0;

    playStarSound();
  }

  handleMove(e) {
    if (!this.holding) return;

    const rect = this.card.getBoundingClientRect();
    const deltaX = e.clientX - (rect.left + this.startX);
    const deltaY = e.clientY - (rect.top + this.startY);

    this.currentX += deltaX * 0.1;
    this.currentY += deltaY * 0.1;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > 50) {
      this.hasMoved = true;
    }

    this.card.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${this.rotation}deg) scale(1.05)`;
  }

  endDrag() {
    if (this.holding && this.hasMoved && this.index === currentIndex) {
      currentIndex++;
      progressDots[this.index].classList.remove('active');

      if (currentIndex < starCards.length) {
        progressDots[currentIndex].classList.add('active');
        const nextCard = starCards[currentIndex];
        nextCard.style.display = 'block';
        animateParagraphsSequentially(nextCard);
        createStarBurst();
      }
    }

    if (this.holding) {
      this.card.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${this.rotation}deg)`;
    }

    this.holding = false;
  }
}

// Initialize star cards
starCards.forEach((card, index) => new StarCard(card, index));

// Enhanced shooting stars
function createShootingStar() {
  const star = document.createElement('div');
  star.className = 'shooting-star';
  star.style.top = Math.random() * (window.innerHeight * 0.3) + 'px';
  star.style.left = window.innerWidth + 'px';
  star.style.animationDuration = (Math.random() * 3 + 3) + 's';
  star.style.animationDelay = Math.random() * 2 + 's';

  document.querySelector('.shooting-stars').appendChild(star);

  setTimeout(() => {
    if (star.parentNode) {
      star.parentNode.removeChild(star);
    }
  }, 6000);
}

// Create cosmic dust
function createCosmicDust() {
  const container = document.querySelector('.cosmic-dust');
  if (!container) {
    const dustContainer = document.createElement('div');
    dustContainer.className = 'cosmic-dust';
    document.body.appendChild(dustContainer);
  }

  const particle = document.createElement('div');
  particle.className = 'dust-particle';
  particle.style.left = Math.random() * window.innerWidth + 'px';
  particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
  particle.style.animationDelay = Math.random() * 5 + 's';

  document.querySelector('.cosmic-dust').appendChild(particle);

  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, 25000);
}

// Star burst effect
function createStarBurst() {
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const burst = document.createElement('div');
      burst.style.position = 'absolute';
      burst.style.width = '4px';
      burst.style.height = '4px';
      burst.style.background = 'white';
      burst.style.borderRadius = '50%';
      burst.style.left = '50%';
      burst.style.top = '50%';
      burst.style.zIndex = '1000';
      burst.style.pointerEvents = 'none';
      burst.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)';

      const angle = (i / 12) * Math.PI * 2;
      const distance = 100;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;

      burst.style.animation = `burstOut 1s ease-out forwards`;
      burst.style.setProperty('--endX', endX + 'px');
      burst.style.setProperty('--endY', endY + 'px');

      document.body.appendChild(burst);

      setTimeout(() => document.body.removeChild(burst), 1000);
    }, i * 50);
  }
}

// Add burst animation
const style = document.createElement('style');
style.textContent = `
      @keyframes burstOut {
        0% { 
          transform: translate(-50%, -50%) scale(1); 
          opacity: 1; 
        }
        100% { 
          transform: translate(calc(-50% + var(--endX)), calc(-50% + var(--endY))) scale(0); 
          opacity: 0; 
        }
      }
    `;
document.head.appendChild(style);

// Audio functions
function toggleMusic() {
  const audio = document.getElementById('bgMusic');
  const button = document.querySelector('.audio-control');

  if (musicEnabled) {
    audio.pause();
    button.innerHTML = '🔇 Cosmic Audio';
    musicEnabled = false;
  } else {
    audio.play().catch(() => {
      button.innerHTML = '🔇 Audio Unavailable';
    });
    button.innerHTML = '🔊 Cosmic Audio';
    musicEnabled = true;
  }
}

function playStarSound() {
  if (musicEnabled) {
    // Create a simple tone for star interaction
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }
}

// Start intervals for dynamic effects
setInterval(createShootingStar, 2000);
setInterval(createCosmicDust, 800);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    if (currentIndex < starCards.length - 1) {
      progressDots[currentIndex].classList.remove('active');
      currentIndex++;
      progressDots[currentIndex].classList.add('active');
      starCards[currentIndex].style.display = 'block';
      animateParagraphsSequentially(starCards[currentIndex]);
      createStarBurst();
    }
  }
});

// Auto-hide instructions
setTimeout(() => {
  const instructions = document.querySelector('.instructions');
  if (instructions) {
    instructions.style.animation = 'none';
    instructions.style.opacity = '0';
  }
}, 8000);