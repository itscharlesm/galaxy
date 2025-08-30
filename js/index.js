let highestZ = 1;
let currentIndex = 0;

const starCards = Array.from(document.querySelectorAll('.star-card'));

// Hide all except first
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
      void p.offsetWidth; // restart animation
      p.classList.add('animate-type');

      setTimeout(() => {
        current++;
        showNext();
      }, 2000);
    } else {
      const img = card.querySelector('img');
      if (img) img.style.display = 'block';
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
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentX = 0;
    this.currentY = 0;
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => this.handleMove(e));
    document.addEventListener('touchmove', (e) => this.handleMove(e.touches[0]));

    this.card.addEventListener('mousedown', (e) => this.startDrag(e));
    this.card.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));

    window.addEventListener('mouseup', () => this.endDrag());
    window.addEventListener('touchend', () => this.endDrag());
  }

  handleMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.velX = this.mouseX - this.prevMouseX;
    this.velY = this.mouseY - this.prevMouseY;

    if (this.holding) {
      this.currentX += this.velX;
      this.currentY += this.velY;
      this.hasMoved = true;

      this.card.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${this.rotation}deg)`;
    }

    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;
  }

  startDrag(e) {
    if (this.holding) return;

    this.holding = true;
    this.card.style.zIndex = highestZ++;

    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;
  }

  endDrag() {
    if (this.holding && this.hasMoved && this.index === currentIndex) {
      currentIndex++;
      const next = starCards[currentIndex];
      if (next) {
        next.style.display = 'block';
        animateParagraphsSequentially(next);
      }
    }
    this.holding = false;
  }
}

starCards.forEach((card, index) => new StarCard(card, index));

/* Shooting stars generator */
const shootingContainer = document.querySelector('.shooting-stars');
setInterval(() => {
  const star = document.createElement('div');
  star.className = 'shooting-star';
  star.style.top = Math.random() * window.innerHeight + 'px';
  star.style.left = window.innerWidth + 'px';
  star.style.animationDuration = (Math.random() * 2 + 2) + 's';
  shootingContainer.appendChild(star);

  setTimeout(() => shootingContainer.removeChild(star), 3000);
}, 1500);