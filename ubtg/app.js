/* ==========================================================================
   UBTG User Tutorial - Interactive Logic (Fluent UI)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure pure dark theme
  document.documentElement.setAttribute('data-theme', 'dark');
  try {
    localStorage.removeItem('ubtg-theme');
  } catch (e) {}

  initCopyButtons();
  initTabs();
  initCommandFilter();
  initCliGenerator();
  initFaqAccordion();
  initScrollSpy();
  initMobileMenu();
  initInteractiveChatDemo();
  initScreenshotModal();
});

/* ==========================================================================
   Copy to Clipboard & Toast Notifications
   ========================================================================== */
function initCopyButtons() {
  document.querySelectorAll('.code-copy-btn, .cmd-copy-icon').forEach(btn => {
    btn.addEventListener('click', async () => {
      let textToCopy = btn.getAttribute('data-copy');
      
      if (!textToCopy) {
        const codeBlock = btn.closest('.code-container')?.querySelector('.code-body pre');
        if (codeBlock) {
          textToCopy = codeBlock.innerText;
        }
      }

      if (textToCopy) {
        try {
          await navigator.clipboard.writeText(textToCopy.trim());
          
          if (btn.classList.contains('code-copy-btn')) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span>✓</span> Скопировано!';
            btn.classList.add('copied');
            setTimeout(() => {
              btn.innerHTML = originalText;
              btn.classList.remove('copied');
            }, 2000);
          } else {
            showToast('Скопировано в буфер обмена!');
          }
        } catch (err) {
          showToast('Ошибка при копировании', 'error');
        }
      }
    });
  });
}

function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'fluent-toast';
  const icon = type === 'error' ? '❌' : '✨';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

/* ==========================================================================
   Segmented Tabs Navigation
   ========================================================================== */
function initTabs() {
  document.querySelectorAll('.fluent-tabs-wrapper').forEach(wrapper => {
    const tabButtons = wrapper.querySelectorAll('.fluent-tab-btn');
    const tabPanes = wrapper.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePane = wrapper.querySelector(`#${targetId}`);
        if (activePane) {
          activePane.classList.add('active');
        }
      });
    });
  });
}

/* ==========================================================================
   Interactive Commands Filter & Real-Time Search
   ========================================================================== */
function initCommandFilter() {
  const searchInput = document.getElementById('cmdSearchInput');
  const filterPills = document.querySelectorAll('.filter-pill');
  const cmdCards = document.querySelectorAll('.cmd-card');

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    cmdCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardName = card.querySelector('.cmd-name')?.textContent.toLowerCase() || '';
      const cardDesc = card.querySelector('.cmd-desc')?.textContent.toLowerCase() || '';
      const cardUsage = card.querySelector('.cmd-usage')?.textContent.toLowerCase() || '';

      const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
      const matchesSearch = !searchQuery || 
        cardName.includes(searchQuery) || 
        cardDesc.includes(searchQuery) || 
        cardUsage.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-filter');
      applyFilters();
    });
  });
}

/* ==========================================================================
   Interactive CLI Command Generator
   ========================================================================== */
function initCliGenerator() {
  const chkDebug = document.getElementById('chkDebug');
  const chkNoWeb = document.getElementById('chkNoWeb');
  const chkCustomPort = document.getElementById('chkCustomPort');
  const inputPort = document.getElementById('inputPort');
  const chkHost = document.getElementById('chkHost');
  const chkPreloadApi = document.getElementById('chkPreloadApi');
  const inputAppId = document.getElementById('inputAppId');
  const inputHashId = document.getElementById('inputHashId');
  const chkProxy = document.getElementById('chkProxy');
  const inputProxyIp = document.getElementById('inputProxyIp');
  const inputProxyPort = document.getElementById('inputProxyPort');
  const selectProxyProto = document.getElementById('selectProxyProto');

  const cliOutput = document.getElementById('cliOutput');
  const copyCliBtn = document.getElementById('copyCliBtn');

  function updateCliCommand() {
    let parts = ['python3', 'userbot.py'];

    if (chkDebug && chkDebug.checked) parts.push('--debug');
    if (chkNoWeb && chkNoWeb.checked) parts.push('--no-web');
    if (chkHost && chkHost.checked) parts.push('--host');

    if (chkCustomPort && chkCustomPort.checked && inputPort && inputPort.value.trim()) {
      parts.push(`--port ${inputPort.value.trim()}`);
    }

    if (chkPreloadApi && chkPreloadApi.checked) {
      if (inputAppId && inputAppId.value.trim()) {
        parts.push(`--set-app-id ${inputAppId.value.trim()}`);
      }
      if (inputHashId && inputHashId.value.trim()) {
        parts.push(`--set-hash-id ${inputHashId.value.trim()}`);
      }
    }

    if (chkProxy && chkProxy.checked) {
      if (inputProxyIp && inputProxyIp.value.trim()) {
        parts.push(`--set-proxy-ip ${inputProxyIp.value.trim()}`);
      }
      if (inputProxyPort && inputProxyPort.value.trim()) {
        parts.push(`--set-proxy-port ${inputProxyPort.value.trim()}`);
      }
      if (selectProxyProto && selectProxyProto.value) {
        parts.push(`--set-proxy-protocol ${selectProxyProto.value}`);
      }
    }

    const finalCmd = parts.join(' ');
    if (cliOutput) {
      cliOutput.textContent = finalCmd;
    }
    if (copyCliBtn) {
      copyCliBtn.setAttribute('data-copy', finalCmd);
    }
  }

  // Bind Listeners
  const inputs = [
    chkDebug, chkNoWeb, chkCustomPort, inputPort, chkHost,
    chkPreloadApi, inputAppId, inputHashId,
    chkProxy, inputProxyIp, inputProxyPort, selectProxyProto
  ];

  inputs.forEach(el => {
    if (!el) return;
    el.addEventListener('input', updateCliCommand);
    el.addEventListener('change', updateCliCommand);
  });

  if (copyCliBtn) {
    copyCliBtn.addEventListener('click', () => {
      const cmd = cliOutput.textContent;
      navigator.clipboard.writeText(cmd).then(() => {
        showToast('Команда запуска скопирована!');
      });
    });
  }

  // Initial build
  updateCliCommand();
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq-item');
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Scroll Spy & Navigation Highlight
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('.section-block');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function updateActiveLinks() {
    let currentId = '';
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 130;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
      mobileNavLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
    }
  }

  window.addEventListener('scroll', updateActiveLinks, { passive: true });
  updateActiveLinks();
}

/* ==========================================================================
   Mobile Menu & Drawer Offcanvas
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileBackdrop');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cloud-cta, .mobile-footer-link');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mobile-menu-open');
  }

  function closeMenu() {
    drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mobile-menu-open');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && drawer.classList.contains('active')) {
      closeMenu();
    }
  }, { passive: true });
}

/* ==========================================================================
   Hero Preview Interactive Demo
   ========================================================================== */
function initInteractiveChatDemo() {
  const demoBtn = document.getElementById('demoInteractiveBtn');
  const demoStatus = document.getElementById('demoStatusText');
  let clickCount = 0;

  if (demoBtn && demoStatus) {
    demoBtn.addEventListener('click', () => {
      clickCount++;
      demoStatus.innerHTML = `⚡ <b>Пинг:</b> <span class="chat-stat-val">3${clickCount * 2} мс</span> | Клик: <b>#${clickCount}</b>`;
      showToast(`Инлайн-кнопка бота обработана! (Пинг: 3${clickCount * 2}мс)`);
    });
  }
}

/* ==========================================================================
   Screenshot Modal Lightbox
   ========================================================================== */
function initScreenshotModal() {
  const modal = document.getElementById('screenshotModal');
  const modalImg = document.getElementById('modalImage');
  const modalClose = document.getElementById('modalCloseBtn');

  if (!modal || !modalImg) return;

  document.querySelectorAll('.screenshot-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.screenshot-img');
      if (img) {
        modalImg.src = img.src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
