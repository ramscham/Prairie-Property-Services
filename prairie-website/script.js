// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
    document.body.classList.toggle('no-scroll', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }));
}

// Fade-in on scroll
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  items.forEach(el => io.observe(el));
} else {
  items.forEach(el => el.classList.add('in'));
}

// Quote form (contact page): preselect from link, then open the visitor's email app
const form = document.getElementById('quote-form');
if (form) {
  const params = new URLSearchParams(location.search);
  const svc = params.get('service'), type = params.get('type');
  if (svc) document.getElementById('f-service').value = svc;
  if (type) document.getElementById('f-type').value = type;

  const note = document.getElementById('form-note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const d = new FormData(form);
    const body = [
      'Name: ' + d.get('name'),
      'Phone: ' + d.get('phone'),
      'Email: ' + d.get('email'),
      'Property type: ' + d.get('type'),
      'Service: ' + d.get('service'),
      'City: ' + (d.get('city') || ''),
      '',
      'Details:',
      d.get('message') || ''
    ].join('\n');
    const subject = 'Quote request: ' + d.get('service') + ' (' + d.get('type') + ')';
    window.location.href = 'mailto:info@prairiepropertyservices.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Your email app should open. If it does not, call (780) 217-1839.';
  });
}

const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();
