/**
 * UBTG Developer Docs - Interactive Script (dev.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initDevCopyButtons();
  initDevScrollSpy();
  initDevSearch();
  initDevMobileMenu();
});

function initDevCopyButtons() {
  document.querySelectorAll('.dev-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showDevToast('Код скопирован в буфер обмена!');
        const origText = btn.textContent;
        btn.textContent = '✓ Скопировано';
        setTimeout(() => { btn.textContent = origText; }, 2000);
      }).catch(err => {
        console.error('Ошибка копирования:', err);
      });
    });
  });
}

function showDevToast(msg) {
  const toast = document.getElementById('devToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function initDevScrollSpy() {
  const sections = document.querySelectorAll('.dev-section');
  const links = document.querySelectorAll('.dev-nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

function initDevSearch() {
  const input = document.getElementById('devSearchInput');
  const links = document.querySelectorAll('.dev-nav-link');
  const sections = document.querySelectorAll('.dev-nav-section');

  if (!input) return;

  input.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();

    sections.forEach(sec => {
      let hasVisible = false;
      const secLinks = sec.querySelectorAll('.dev-nav-link');
      secLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          link.style.display = 'block';
          hasVisible = true;
        } else {
          link.style.display = 'none';
        }
      });
      sec.style.display = hasVisible ? 'block' : 'none';
    });
  });
}

function initDevMobileMenu() {
  const toggleBtn = document.getElementById('devMobileToggle');
  const sidebar = document.getElementById('devSidebar');
  const backdrop = document.getElementById('devSidebarBackdrop');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('active')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  document.querySelectorAll('.dev-nav-link').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });
}
