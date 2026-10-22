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

// Quote form: opens visitor email app. Photos must be attached manually until backend is connected.
const form = document.getElementById('quote-form');
if (form) {
  const params = new URLSearchParams(location.search);
  const svc = (params.get('service') || '').toLowerCase();
  const type = params.get('type');
  if (type && ['Residential','Commercial'].includes(type)) document.getElementById('f-type').value = type;
  const choices = [...form.querySelectorAll('input[name="service"]')];
  choices.forEach(c => { if (svc.includes(c.value.toLowerCase())) c.checked = true; });
  const note = document.getElementById('form-note');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const selected = choices.filter(c => c.checked).map(c => c.value);
    if (!selected.length) { note.textContent = 'Please select at least one service.'; choices[0].focus(); return; }
    const photos = form.querySelector('input[name="photos"]').files;
    if (photos.length > 5) { note.textContent = 'Please select no more than 5 photos.'; return; }
    const d = new FormData(form);
    const body = [
      'Name: ' + d.get('name'), 'Phone: ' + d.get('phone'), 'Email: ' + d.get('email'),
      'Service address: ' + d.get('address'), 'City: ' + d.get('city'),
      'Property type: ' + d.get('type'), 'Services: ' + selected.join(', '),
      'Preferred date: ' + (d.get('preferred_date') || 'Not specified'),
      'How did you hear about us: ' + (d.get('source') || 'Not specified'),
      '', 'Details:', d.get('message') || 'None', '',
      photos.length ? 'Please attach the ' + photos.length + ' selected photo(s) manually before sending.' : 'No photos selected.'
    ].join('\n');
    const subject = 'Quote request: ' + selected.join(', ');
    window.location.href = 'mailto:prairieservicesyeg@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Your email app should open. Review and send the email' + (photos.length ? ', and attach your photos before sending.' : '.');
  });
}

const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();
