// background slideshow //
const images = [
  'Lib/bg-1.gif',
  'Lib/bg-2.gif',
  'Lib/bg-3.gif',
  'Lib/bg-4.gif'
];

const layers = images.map((_, i) => document.getElementById(`bg${i + 1}`));
let current = 0;

if (!window.bgInitialized) {
  window.bgInitialized = true;
  layers.forEach((layer, i) => {
    layer.style.backgroundImage = `url('${images[i]}')`;
    if (i === 0) layer.classList.add('visible');
  });

  setInterval(() => {
    const next = (current + 1) % layers.length;
    layers[current].classList.remove('visible');
    layers[next].classList.add('visible');
    current = next;
  }, 16000);
}

// sidebar navigation //
const links = document.querySelectorAll('.side-link');
const content = document.getElementById('content');

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('href');
    if (!target || link.classList.contains('active')) return;

    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    loadPage(target);
  });
});

// smooth page loader //
function loadPage(url) {
  if (!url) return;
  content.classList.add('fade-out');

  setTimeout(() => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load: ${url}`);
        return res.text();
      })
      .then(html => {
        content.innerHTML = html;
        content.classList.remove('fade-out');
        void content.offsetWidth; // reflow for transition
        content.classList.add('fade-in');

        setTimeout(() => content.classList.remove('fade-in'), 600);
        const win = content.querySelector('.blog-window, .about-window, .contact-window');
        if (win) fadeInWindow(win);
      })
      .catch(err => console.error('Error loading page:', err));
  }, 400);
}

// window fade effect //
function fadeInWindow(el) {
  el.style.opacity = '0';
  el.style.transform = 'translate(-50%, -48%)';
  requestAnimationFrame(() => {
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    el.style.opacity = '1';
    el.style.transform = 'translate(-50%, -50%)';
  });
}

// initial page load //
window.addEventListener('DOMContentLoaded', () => {
  loadPage('/html/pages/home.html');
});

// // blog + back button //
document.addEventListener('click', e => {
  const link = e.target.closest('.blog-post-link, .back-btn');
  if (!link) return;

  e.preventDefault();
  const target = link.getAttribute('href');
  if (target) loadPage(target);
});

// contact form popup //

document.addEventListener('submit', e => {
  if (e.target.matches('.contact-form')) {
    e.preventDefault();
    const popup = document.getElementById('thankYouPopup');
    if (popup) popup.style.display = 'flex';
    e.target.reset();
  }
});

document.addEventListener('click', e => {
  if (e.target.id === 'closePopup') {
    const popup = document.getElementById('thankYouPopup');
    if (popup) popup.style.display = 'none';
  }
});


