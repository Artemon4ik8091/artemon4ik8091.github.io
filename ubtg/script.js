/**
 * UBTG Userbot - Интерактивный функционал обучающего сайта для новичков & Облачного Хостинга
 * Включает полную витрину топовых модулей (Nekospy, Gemini AI, TicTacToe, AFK, ChatManager, AutoFarm, Compliments и др.)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initCommandsList();
  initSearchAndFilter();
  initSimulator();
  initFaqAccordion();
  initCopyButtons();
  initScrollSpy();
  initCardReveal();
  initMouseGlow();
});

/* ==========================================================================
   1. Мобильное меню-шторка (Mobile Drawer)
   ========================================================================== */
function initMobileDrawer() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   2. Расширенная база данных команд юзербота (Справочник + Топ модули)
   ========================================================================== */
const COMMANDS_DATA = [
  // --- ТОП МОДУЛИ (KILLER FEATURES, УСТАНОВКА ЧЕРЕЗ .GHINSTALL) ---
  {
    name: ".onetime",
    aliases: [".pmspy", ".onetimedump"],
    category: "top",
    categoryName: "🔥 Топ фича",
    badgeClass: "badge-top",
    desc: "Шпионский модуль Nekospy: перехватывает и сохраняет сгорающие фото/видео (TTL) в Избранное и отслеживает удаленные сообщения в ЛС! (Установка: .ghinstall nekospy)",
    usage: ".onetime (вкл/выкл) | Установка: .ghinstall nekospy",
    example: ".onetime"
  },
  {
    name: ".gemini",
    aliases: [".ai", ".gemini_model", ".gemini_models", ".gemini_setup"],
    category: "top",
    categoryName: "🧠 Gemini AI",
    badgeClass: "badge-ai",
    desc: "Флагманский искусственный интеллект Google Gemini: ответы на любые вопросы (.ai), анализ фото по реплаю (решение задач, перевод, код), память диалога и прокси. (Установка: .ghinstall gemini)",
    usage: ".gemini <текст> | .ai <текст> | (реплай на фото) | Установка: .ghinstall gemini",
    example: ".gemini Объясни устройство нейросетей простыми словами"
  },
  {
    name: ".gemini_rules",
    aliases: [".gemini_key", ".gemini_temp", ".gemini_history", ".gemini_clear"],
    category: "top",
    categoryName: "🧠 Gemini AI",
    badgeClass: "badge-config",
    desc: "Кастомизация поведения Gemini AI: системный промпт (.gemini_rules <роль> или реплаем), API-ключ (.gemini_key), переключение моделей (.gemini_model) и очистка истории диалога (.gemini_clear).",
    usage: ".gemini_rules <промпт> | .gemini_rules clear",
    example: ".gemini_rules Ты опытный Python разработчик, отвечай кратко"
  },
  {
    name: ".ttt",
    aliases: [".tictactoe"],
    category: "top",
    categoryName: "🎮 Игры & Инлайн",
    badgeClass: "badge-top",
    desc: "Интерактивная игра в Крестики-Нолики прямо в чате на кликабельных кнопках! Дуэли PvP с другом или против ИИ-бота. (Установка: .ghinstall tictactoe)",
    usage: ".ttt | Установка: .ghinstall tictactoe",
    example: ".ttt"
  },
  {
    name: ".afk",
    aliases: [".afkhere", ".unafk"],
    category: "top",
    categoryName: "💤 Автоматизация",
    badgeClass: "badge-top",
    desc: "Умный автоответчик с защитой от флуда и авто-снятием, как только вы начнете писать любое сообщение. (Установка: .ghinstall afk)",
    usage: ".afk [причина] | Установка: .ghinstall afk",
    example: ".afk Отошел выпить кофе"
  },
  {
    name: ".mute",
    aliases: [".unmute", ".ban", ".kick", ".warn"],
    category: "moderation",
    categoryName: "🛡️ Модерация",
    badgeClass: "badge-mod",
    desc: "Продвинутый Chat Manager: временные муты (.mute 30m спам), баны, кики, система варнов 3/3 (.warn) и очистка (.purge). (Установка: .ghinstall chat_manager)",
    usage: ".mute [время] [причина] | Установка: .ghinstall chat_manager",
    example: ".mute 30m Спам в чате"
  },
  {
    name: ".dmute",
    aliases: [".dunmute", ".dmutelist"],
    category: "moderation",
    categoryName: "🛡️ Модерация",
    badgeClass: "badge-mod",
    desc: "Delete Mute — режим стирания: фоновый перехватчик мгновенно и бесшумно удаляет любые новые сообщения от токсичных пользователей в чате. (Установка: .ghinstall dmute)",
    usage: ".dmute (реплаем) | Установка: .ghinstall dmute",
    example: ".dmute"
  },
  {
    name: ".purge",
    aliases: [".del"],
    category: "moderation",
    categoryName: "🛡️ Модерация",
    badgeClass: "badge-mod",
    desc: "Массовая очистка чата: мгновенно удаляет пачку сообщений числом (.purge 50) или диапазон от реплая. (Входит в модуль chat_manager)",
    usage: ".purge [число]",
    example: ".purge 25"
  },
  {
    name: ".tagall",
    aliases: [],
    category: "top",
    categoryName: "📣 Оповещения",
    badgeClass: "badge-top",
    desc: "Отмечает всех участников чата невидимыми символами порциями по 5 человек с кнопкой «🚫 Отмена» и защитой от спамбана. (Установка: .ghinstall tagall)",
    usage: ".tagall [текст] | Установка: .ghinstall tagall",
    example: ".tagall Общий сбор в голосовом!"
  },
  {
    name: ".farm",
    aliases: [".farm on", ".farm off", ".farm now"],
    category: "top",
    categoryName: "🌾 Автофарм",
    badgeClass: "badge-top",
    desc: "Фоновый автофарм 24/7: автоматически шлет команды и сообщения в игровые чаты и боты с заданным интервалом (~4 часа). (Установка: .ghinstall auto_farm)",
    usage: ".farm [on/off/now] | Установка: .ghinstall auto_farm",
    example: ".farm on"
  },
  {
    name: ".cgirl",
    aliases: [".cboy", ".compliment"],
    category: "fun",
    categoryName: "✨ Фан & Романтика",
    badgeClass: "badge-fun",
    desc: "Генератор лучших персонализированных комплиментов (120+ вариаций) для девушек (.cgirl) и парней (.cboy). (Установка: .ghinstall compliments)",
    usage: ".cgirl [имя] | Установка: .ghinstall compliments",
    example: ".cgirl Алина"
  },
  {
    name: ".ily",
    aliases: [".ilyi", ".cg"],
    category: "fun",
    categoryName: "✨ Фан & Романтика",
    badgeClass: "badge-fun",
    desc: "Знаменитая TikTok-анимация переливающихся сердец LoveMagic и серия из 70 анимированных признаний в любви. (Установка: .ghinstall ily)",
    usage: ".ily [текст] | Установка: .ghinstall ily",
    example: ".ily Ты лучшая!"
  },
  {
    name: ".uwu",
    aliases: [],
    category: "fun",
    categoryName: "✨ Фан & Романтика",
    badgeClass: "badge-fun",
    desc: "UwU Mode: превращает все ваши исходящие сообщения в милые реплики с заиканием, каомодзи и эмодзи на лету! (Установка: .ghinstall uwu_mode)",
    usage: ".uwu (вкл/выкл) | Установка: .ghinstall uwu_mode",
    example: ".uwu"
  },
  {
    name: ".tguy",
    aliases: [],
    category: "fun",
    categoryName: "✨ Фан & Романтика",
    badgeClass: "badge-fun",
    desc: "Анимация забавного уборщика TrashGuy, который выбрасывает указанный текст или сообщение в мусорный бак. (Установка: .ghinstall trashguy)",
    usage: ".tguy <текст> | Установка: .ghinstall trashguy",
    example: ".tguy проблемы"
  },
  {
    name: ".spam",
    aliases: [".stopspam"],
    category: "fun",
    categoryName: "⚡ Скорость",
    badgeClass: "badge-fun",
    desc: "Контролируемый спамер сообщениями с паузой безопасности 0.3с и возможностью моментальной остановки через .stopspam. (Установка: .ghinstall spam)",
    usage: ".spam <количество> <текст> | Установка: .ghinstall spam",
    example: ".spam 10 Просыпайся!"
  },

  // --- БАЗОВЫЕ КОМАНДЫ ЯДРА ---
  {
    name: ".ping",
    aliases: [],
    category: "main",
    categoryName: "Базовые",
    badgeClass: "badge-main",
    desc: "Проверяет работоспособность и скорость отклика юзербота до серверов Telegram.",
    usage: ".ping",
    example: ".ping"
  },
  {
    name: ".help",
    aliases: [".help <имя>"],
    category: "main",
    categoryName: "Базовые",
    badgeClass: "badge-main",
    desc: "Выводит список всех установленных модулей. Если указать имя (например, .help Info) — покажет подробное описание и список команд модуля.",
    usage: ".help [модуль]",
    example: ".help Info"
  },
  {
    name: ".info",
    aliases: [],
    category: "main",
    categoryName: "Базовые",
    badgeClass: "badge-main",
    desc: "Показывает стильную карточку о системе: нагрузку процессора, оперативную память, версию и статус бота. Можно настроить свою картинку и текст!",
    usage: ".info",
    example: ".info"
  },
  {
    name: ".ghsearch",
    aliases: [".ghs", ".repo"],
    category: "modules",
    categoryName: "Модули и магазин",
    badgeClass: "badge-modules",
    desc: "Открывает интерактивный каталог модулей из репозитория со скриншотами, описаниями и инлайн-кнопками установки прямо в чате!",
    usage: ".ghsearch <запрос>",
    example: ".ghsearch погода"
  },
  {
    name: ".ghinstall",
    aliases: [".ghi"],
    category: "modules",
    categoryName: "Модули и магазин",
    badgeClass: "badge-modules",
    desc: "Быстрая установка модуля из официального репозитория по названию. Автоматически скачивает нужные библиотеки.",
    usage: ".ghinstall <имя_модуля>",
    example: ".ghinstall weather"
  },
  {
    name: ".cfg list",
    aliases: [],
    category: "config",
    categoryName: "Конфигурация",
    badgeClass: "badge-config",
    desc: "Показывает список всех настроек и параметров всех модулей, сохраненных в конфигурации.",
    usage: ".cfg list",
    example: ".cfg list"
  },
  {
    name: ".cfg set",
    aliases: [],
    category: "config",
    categoryName: "Конфигурация",
    badgeClass: "badge-config",
    desc: "Изменяет значение настройки. Сам определяет числа, строки и переключатели (true/false) и применяет их налету.",
    usage: ".cfg set <модуль> <параметр> <значение>",
    example: ".cfg set module_info media_path https://i.imgur.com/example.jpg"
  },
  {
    name: ".update",
    aliases: [".update now"],
    category: "system",
    categoryName: "Система",
    badgeClass: "badge-system",
    desc: "Проверяет наличие обновлений для ядра юзербота или сразу обновляет его (.update now).",
    usage: ".update [now]",
    example: ".update now"
  }
];

/* ==========================================================================
   3. Отрисовка списка команд
   ========================================================================== */
function initCommandsList() {
  renderCommands(COMMANDS_DATA);
}

function renderCommands(commands) {
  const container = document.getElementById('commandsGrid');
  if (!container) return;

  if (commands.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
        <h3>Ничего не найдено</h3>
        <p>Попробуйте изменить поисковый запрос или сбросить фильтр категорий.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = commands.map(cmd => `
    <div class="cmd-card" data-category="${cmd.category}">
      <div class="cmd-header">
        <div class="cmd-title-group">
          <span class="cmd-name">${cmd.name}</span>
          <span class="cmd-badge ${cmd.badgeClass}">${cmd.categoryName}</span>
        </div>
        <button class="copy-cmd-btn" data-copy="${cmd.example}" title="Скопировать пример команды">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
      <p class="cmd-desc">${cmd.desc}</p>
      ${cmd.aliases && cmd.aliases.length > 0 ? `<div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">Алиасы: <code>${cmd.aliases.join(', ')}</code></div>` : ''}
      <div class="cmd-usage">
        Использование: <span>${cmd.usage}</span>
      </div>
    </div>
  `).join('');

  // Привязываем события копирования к новым кнопкам
  container.querySelectorAll('.copy-cmd-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = btn.getAttribute('data-copy');
      copyToClipboard(text);
    });
  });

  // Применяем динамическое свечение курсора мыши для карточек команд
  initMouseGlow();
}

/* ==========================================================================
   4. Поиск и фильтрация команд
   ========================================================================== */
function initSearchAndFilter() {
  const searchInput = document.getElementById('cmdSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let currentCategory = 'all';
  let currentQuery = '';

  function applyFilters() {
    const filtered = COMMANDS_DATA.filter(cmd => {
      const matchCategory = currentCategory === 'all' || cmd.category === currentCategory;
      const q = currentQuery.toLowerCase();
      const matchQuery = !q || 
        cmd.name.toLowerCase().includes(q) ||
        cmd.desc.toLowerCase().includes(q) ||
        cmd.usage.toLowerCase().includes(q) ||
        (cmd.aliases && cmd.aliases.some(a => a.toLowerCase().includes(q)));

      return matchCategory && matchQuery;
    });

    renderCommands(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value.trim();
      if (clearBtn) {
        clearBtn.style.display = currentQuery ? 'block' : 'none';
      }
      applyFilters();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentQuery = '';
      clearBtn.style.display = 'none';
      applyFilters();
      searchInput.focus();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      applyFilters();
    });
  });
}

/* ==========================================================================
   5. Интерактивный Telegram Чат-Симулятор с новыми фичами
   ========================================================================== */
function initSimulator() {
  const chatBody = document.getElementById('tgChatBody');
  const inputForm = document.getElementById('tgInputForm');
  const inputField = document.getElementById('tgInput');
  const chips = document.querySelectorAll('.chip-btn');
  const demoTime = document.getElementById('demoTime');

  if (demoTime) {
    const now = new Date();
    demoTime.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cmd = chip.getAttribute('data-cmd');
      executeSimulatedCommand(cmd);
    });
  });

  if (inputForm) {
    inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = inputField.value.trim();
      if (!text) return;
      inputField.value = '';
      executeSimulatedCommand(text);
    });
  }

  function executeSimulatedCommand(text) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const msgEl = document.createElement('div');
    msgEl.className = 'tg-msg msg-out';
    msgEl.innerHTML = `
      <div class="msg-bubble">
        <div class="msg-text">${escapeHtml(text)}</div>
        <div class="msg-meta">
          <span class="msg-time">${timeStr}</span>
          <span class="msg-status">✓✓</span>
        </div>
      </div>
    `;

    chatBody.appendChild(msgEl);
    chatBody.scrollTop = chatBody.scrollHeight;

    if (text.startsWith('.')) {
      setTimeout(() => {
        respondToSimulatedCommand(msgEl, text, timeStr);
      }, 350);
    } else {
      setTimeout(() => {
        const hintEl = document.createElement('div');
        hintEl.className = 'tg-msg msg-out';
        hintEl.innerHTML = `
          <div class="msg-bubble" style="background: #1c2b38;">
            <div class="msg-text">💡 <em>Подсказка: команды юзербота начинаются с точки, например <code>.onetime</code>, <code>.ttt</code>, <code>.afk</code> или <code>.cgirl</code></em></div>
            <div class="msg-meta">
              <span class="msg-time">${timeStr}</span>
              <span class="msg-status">✓✓</span>
            </div>
          </div>
        `;
        chatBody.appendChild(hintEl);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 400);
    }
  }

  function respondToSimulatedCommand(msgEl, rawCmd, timeStr) {
    const bubble = msgEl.querySelector('.msg-bubble');
    const textEl = bubble.querySelector('.msg-text');
    const cmd = rawCmd.trim().toLowerCase();

    // 1. NEKOSPY
    if (cmd === '.onetime' || cmd === '.pmspy') {
      textEl.innerHTML = `
        🔥 <b>Перехват одноразовых медиа:</b> <span style="color:#4ade80;">ВКЛЮЧЕН ✅</span><br>
        🕵️‍♂️ <b>Шпион за сообщениями в ЛС:</b> <span style="color:#4ade80;">ВКЛЮЧЕН ✅</span><br><br>
        ℹ️ <i>Все сгорающие фото/видео и удаленные собеседником сообщения автоматически сохраняются в Избранное!</i>
      `;
    }
    // 2. GEMINI AI
    else if (cmd.startsWith('.gemini') || cmd.startsWith('.ai')) {
      const query = rawCmd.replace(/^\.(gemini|ai)\s*/i, '').trim();
      const question = query || "Расскажи интересный факт о космосе";
      let answer = "";
      
      if (question.toLowerCase().includes("факт") || question.toLowerCase().includes("космос")) {
        answer = "🌌 <b>Космический факт:</b> Один день на Венере длится дольше, чем целый венерианский год! Планета совершает один оборот вокруг своей оси за 243 земных дня, а вокруг Солнца обращается за 225 дней.";
      } else if (question.toLowerCase().includes("код") || question.toLowerCase().includes("python")) {
        answer = "💻 <b>Код на Python:</b><br><pre><code>async def ask_gemini(prompt):\n    # Прямой запрос к Google Gemini AI\n    return await gemini.generate_content(prompt)\nprint('Готово! 🚀')</code></pre>";
      } else {
        answer = `✨ Я успешно обработал твой запрос <i>«${escapeHtml(question)}»</i> через модель <b>gemini-2.5-flash</b>!<br><br>Я умею анализировать фото по реплаю (решать уравнения, объяснять мемы, переводить текст), поддерживать связную нить диалога с памятью контекста и работать по твоим правилам <code>.gemini_rules</code>.`;
      }

      textEl.innerHTML = `
        🧠 <b>Google Gemini AI</b> <i>(gemini-2.5-flash)</i>:<br><br>
        ${answer}<br><br>
        <div class="tg-inline-keyboard">
          <div class="tg-btn-row">
            <button class="tg-inline-btn" style="font-size:0.75rem;">⚡ gemini-2.5-flash</button>
            <button class="tg-inline-btn" style="font-size:0.75rem;">🧠 Память: Вкл</button>
          </div>
          <div class="tg-btn-row">
            <button class="tg-inline-btn" style="font-size:0.75rem;">🎭 Правила: <code>.gemini_rules</code></button>
          </div>
        </div>
      `;
    }
    else if (cmd.startsWith('.gemini_rules')) {
      const rules = rawCmd.replace(/^\.gemini_rules\s*/i, '').trim();
      if (!rules || rules.toLowerCase() === 'clear') {
        textEl.innerHTML = `
          🎭 <b>Системные правила Gemini сброшены!</b><br>
          Теперь модель отвечает в стандартном режиме ассистента.
        `;
      } else {
        textEl.innerHTML = `
          🎭 <b>Установлены новые правила для Gemini AI:</b><br>
          <i>«${escapeHtml(rules)}»</i><br><br>
          ✅ <i>Теперь нейросеть будет строго отыгрывать эту роль во всех ответах!</i>
        `;
      }
    }
    // 2. TICTACTOE
    else if (cmd === '.ttt' || cmd === '.tictactoe') {
      textEl.innerHTML = `
        🎮 <b>Крестики-Нолики</b><br>
        ❌ <b>Ты</b> 🆚 ⭕ <b>🤖 ИИ-Бот</b><br><br>
        👉 Сейчас твой ход: ❌
        <div class="tg-inline-keyboard">
          <div class="tg-btn-row">
            <button class="tg-inline-btn sim-ttt">❌</button>
            <button class="tg-inline-btn sim-ttt">⬜</button>
            <button class="tg-inline-btn sim-ttt">⭕</button>
          </div>
          <div class="tg-btn-row">
            <button class="tg-inline-btn sim-ttt">⬜</button>
            <button class="tg-inline-btn sim-ttt">❌</button>
            <button class="tg-inline-btn sim-ttt">⬜</button>
          </div>
          <div class="tg-btn-row">
            <button class="tg-inline-btn sim-ttt">⭕</button>
            <button class="tg-inline-btn sim-ttt">⬜</button>
            <button class="tg-inline-btn sim-ttt">⬜</button>
          </div>
        </div>
      `;
    }
    // 3. AFK
    else if (cmd.startsWith('.afk')) {
      const reason = rawCmd.substring(4).trim() || "Отдыхаю от интернета.";
      textEl.innerHTML = `
        💤 <b>Я ушел в AFK.</b><br>
        💬 Причина: <i>${escapeHtml(reason)}</i><br><br>
        ✨ <i>Автоответчик включен. AFK автоматически снимется, как только вы отправите любое сообщение!</i>
      `;
    }
    // 4. COMPLIMENTS
    else if (cmd.startsWith('.cgirl') || cmd.startsWith('.compliment')) {
      textEl.innerHTML = `
        ✨ <b>Алина</b>, твоя улыбка способна осветить даже самый пасмурный день! В тебе удивительным образом сочетаются нежность и невероятная внутренняя сила. 🌸
      `;
    }
    // 5. TAGALL
    else if (cmd.startsWith('.tagall')) {
      textEl.innerHTML = `
        🧚‍♀️ <b>Отмечаю участников чата...</b><br>
        📣 <i>Общий сбор в голосовом канале!</i>
        <div class="tg-inline-keyboard">
          <div class="tg-btn-row">
            <button class="tg-inline-btn" style="color:#ef4444;">🚫 Отмена</button>
          </div>
        </div>
      `;
    }
    // 6. AUTOFARM
    else if (cmd.startsWith('.farm')) {
      textEl.innerHTML = `
        🌾 <b>Статус автофарма:</b> <span style="color:#4ade80;">ВКЛЮЧЕН ✅</span><br>
        🎯 <b>Целевой чат:</b> <code>@game_bot</code><br>
        💬 <b>Команда:</b> <code>Фарма</code><br>
        ⏳ <b>Интервал:</b> <code>14400 сек (~4 часа)</code><br>
        🤖 <i>Бот автоматически собирает награды по расписанию!</i>
      `;
    }
    // 7. UWU
    else if (cmd === '.uwu') {
      textEl.innerHTML = `
        🎀 <b>UwU Mode:</b> <span style="color:#f472b6;">ВКЛЮЧЕН 🌸</span><br>
        т-т-теперь все твои с-сообщения будут о-очень милыми! (⁄ ⁄•⁄ω⁄•⁄ ⁄) *улыбается* 💕
      `;
    }
    // 8. TRASHGUY
    else if (cmd.startsWith('.tguy')) {
      textEl.innerHTML = `
        🗑️ ( > ^_^) > 🗑️ <b>[Проблемы]</b><br>
        <i>Уборщик успешно выкинул всё ненужное в мусорку!</i>
      `;
    }
    // 9. PING
    else if (cmd === '.ping') {
      const pingTime = Math.floor(Math.random() * 15) + 18;
      const tgApiTime = Math.floor(Math.random() * 25) + 30;
      textEl.innerHTML = `
        🏓 <b>Pong!</b><br>
        ⚡ Задержка отклика: <code>${pingTime}ms</code><br>
        🌐 Telegram API: <code>${tgApiTime}ms</code><br>
        ☁️ <b>Хост:</b> <span style="color:#38bdf8;">@aswer_ubtg_host_bot (24/7)</span>
      `;
    }
    // 10. HELP
    else if (cmd === '.help') {
      textEl.innerHTML = `
        <b>🤖 Список установленных модулей:</b><br><br>
        • 🔥 <b>Nekospy</b> (<code>.onetime</code>, <code>.pmspy</code>)<br>
        • 🧠 <b>Google Gemini AI</b> (<code>.gemini</code>, <code>.ai</code>, <code>.gemini_rules</code>)<br>
        • 🎮 <b>TicTacToe</b> (<code>.ttt</code>)<br>
        • 💤 <b>AFK</b> (<code>.afk</code>, <code>.unafk</code>)<br>
        • 🛡️ <b>Chat Manager</b> (<code>.mute</code>, <code>.ban</code>, <code>.purge</code>)<br>
        • 🌾 <b>Auto Farm</b> (<code>.farm</code>)<br>
        • ✨ <b>Compliments</b> (<code>.cgirl</code>, <code>.cboy</code>, <code>.ily</code>)<br>
        • 🛍️ <b>Package Manager</b> (<code>.ghsearch</code>, <code>.upgrade</code>)<br><br>
        💡 <i>Введи <code>.help &lt;Модуль&gt;</code> для справки</i>
      `;
    }
    // 11. GHINSTALL
    else if (cmd.startsWith('.ghinstall')) {
      const target = rawCmd.replace(/^\.ghinstall\s*/i, '').trim().toLowerCase();
      if (target === 'gemini' || target.includes('gemini')) {
        textEl.innerHTML = `
          ⏳ <b>Загрузка и компиляция модуля <code>Gemini AI</code>...</b><br>
          📦 Проверка библиотек: <code>aiohttp</code>, <code>aiohttp-socks</code>... OK!<br>
          ✅ <b>Модуль <code>Google Gemini AI</code> успешно установлен и активен!</b><br><br>
          💡 <i>Попробуй команду:</i> <code>.gemini Расскажи факт</code> <i>или настрой ключ:</i> <code>.gemini_setup</code>
        `;
      } else if (target === 'nekospy') {
        textEl.innerHTML = `
          ⏳ <b>Загрузка модуля <code>Nekospy</code>...</b><br>
          ✅ <b>Модуль <code>Nekospy</code> успешно установлен и готов к работе!</b><br><br>
          💡 <i>Попробуй команду:</i> <code>.onetime</code>
        `;
      } else {
        textEl.innerHTML = `
          ✅ <b>Модуль <code>${escapeHtml(target || 'модуль')}</code> успешно установлен!</b><br>
          Напиши <code>.help</code> для списка доступных команд.
        `;
      }
    }
    // 12. GHSEARCH
    else if (cmd.startsWith('.ghsearch') || cmd === '.repo') {
      const searchQ = rawCmd.replace(/^\.ghsearch\s*/i, '').trim().toLowerCase();
      const showGemini = searchQ.includes('gemini') || searchQ.includes('ии') || searchQ.includes('ai');

      const renderCatalogView = (isGemini) => {
        if (isGemini) {
          textEl.innerHTML = `
            🛍️ <b>Каталог модулей (2/12):</b><br><br>
            📦 <b>Google Gemini AI (Нейросеть)</b><br>
            📖 <i>Флагманский ИИ: ответы на вопросы, анализ фото по реплаю, память контекста и системный промпт!</i><br>
            👤 Автор: <code>aswer</code><br>
            🏷️ Команды: <code>.gemini</code>, <code>.ai</code>, <code>.gemini_rules</code>
            <div class="tg-inline-keyboard">
              <div class="tg-btn-row">
                <button class="tg-inline-btn sim-install-gemini">⬇️ Установить Gemini AI</button>
              </div>
              <div class="tg-btn-row">
                <button class="tg-inline-btn sim-to-neko">⬅️ Nekospy</button>
                <button class="tg-inline-btn sim-to-neko">Вперед ➡️</button>
              </div>
            </div>
          `;
          const geminiInstall = textEl.querySelector('.sim-install-gemini');
          if (geminiInstall) {
            geminiInstall.addEventListener('click', () => {
              geminiInstall.textContent = '⏳ Установка...';
              geminiInstall.style.opacity = '0.7';
              setTimeout(() => {
                textEl.innerHTML = `✅ <b>Модуль <code>Google Gemini AI</code> успешно установлен!</b><br>Попробуй команду: <code>.gemini Объясни устройство нейросетей</code>`;
                chatBody.scrollTop = chatBody.scrollHeight;
              }, 850);
            });
          }
          const toNekoBtns = textEl.querySelectorAll('.sim-to-neko');
          toNekoBtns.forEach(btn => btn.addEventListener('click', () => renderCatalogView(false)));
        } else {
          textEl.innerHTML = `
            🛍️ <b>Каталог модулей (1/12):</b><br><br>
            📦 <b>Nekospy (Шпион)</b><br>
            📖 <i>Перехват одноразовых фото/видео и удаленных сообщений в ЛС!</i><br>
            👤 Автор: <code>aswer</code><br>
            🏷️ Команды: <code>.onetime</code>, <code>.pmspy</code>
            <div class="tg-inline-keyboard">
              <div class="tg-btn-row">
                <button class="tg-inline-btn sim-install-btn">⬇️ Установить Nekospy</button>
              </div>
              <div class="tg-btn-row">
                <button class="tg-inline-btn sim-to-gemini">⬅️ Назад</button>
                <button class="tg-inline-btn sim-to-gemini">Gemini AI ➡️</button>
              </div>
            </div>
          `;
          const installBtn = textEl.querySelector('.sim-install-btn');
          if (installBtn) {
            installBtn.addEventListener('click', () => {
              installBtn.textContent = '⏳ Установка и настройка...';
              installBtn.style.opacity = '0.7';
              setTimeout(() => {
                textEl.innerHTML = `✅ <b>Модуль <code>Nekospy</code> успешно установлен и готов к работе!</b><br>Попробуй команду: <code>.onetime</code>`;
                chatBody.scrollTop = chatBody.scrollHeight;
              }, 850);
            });
          }
          const toGeminiBtns = textEl.querySelectorAll('.sim-to-gemini');
          toGeminiBtns.forEach(btn => btn.addEventListener('click', () => renderCatalogView(true)));
        }
        chatBody.scrollTop = chatBody.scrollHeight;
      };

      renderCatalogView(showGemini);
    }
    // 12. INFO
    else if (cmd === '.info') {
      const ram = (Math.random() * 10 + 42).toFixed(2);
      const cpu = (Math.random() * 3 + 1).toFixed(1);
      textEl.innerHTML = `
        Привет! Я юзербот, созданный для максимальной прокачки Telegram. 😎<br><br>
        💻 <b>Системная сводка:</b><br>
        <b>ЦП:</b> <code>${cpu}%</code> | <b>ОЗУ:</b> <code>${ram} МБ</code><br>
        <b>Сервер:</b> <code>@aswer_ubtg_host_bot (Online 24/7)</code><br>
        <b>Активных модулей:</b> <code>12</code><br><br>
        🤖 <b>UBTG Userbot | by aswer</b>
      `;
    }
    else {
      textEl.innerHTML = `
        ❌ <b>Команда <code>${escapeHtml(rawCmd)}</code> не найдена!</b><br>
        Напиши <code>.help</code> чтобы посмотреть список всех доступных команд.
      `;
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

/* ==========================================================================
   6. Аккордеон FAQ
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   7. Копирование в буфер обмена + Toast
   ========================================================================== */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      copyToClipboard(text);
    });
  });
}

function copyToClipboard(text) {
  if (!text) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showToast).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast();
  } catch (err) {
    console.error('Не удалось скопировать:', err);
  }
  document.body.removeChild(textArea);
}

let toastTimer = null;
function showToast() {
  const toast = document.getElementById('copyToast');
  if (!toast) return;

  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

/* ==========================================================================
   8. Scroll Spy (Подсветка активного пункта меню)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

/* ==========================================================================
   9. Эффекты появления карточек при скролле (Card Reveal Animation)
   ========================================================================== */
function initCardReveal() {
  const cards = document.querySelectorAll(
    '.killer-card, .bento-card, .pricing-card, .step-card, .stat-card, .comparison-card, .cloud-hero-box, .selfhost-terminal-card, .cfg-card'
  );

  if (!cards.length) return;

  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => c.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  // Группируем карточки по родителям для плавного каскадного появления
  const parentMap = new Map();
  cards.forEach(card => {
    const parent = card.parentElement || document.body;
    if (!parentMap.has(parent)) {
      parentMap.set(parent, []);
    }
    parentMap.get(parent).push(card);
  });

  parentMap.forEach(group => {
    group.forEach((card, idx) => {
      card.classList.add('reveal-card');
      card.style.transitionDelay = `${(idx % 4) * 80}ms`;
      observer.observe(card);
    });
  });
}

/* ==========================================================================
   10. Свечение карточек при наведении курсором мыши (Mouse Spotlight Glow)
   ========================================================================== */
function initMouseGlow() {
  const glowElements = document.querySelectorAll(
    '.killer-card, .bento-card, .pricing-card, .step-card, .cmd-card, .stat-card, .comparison-card, .cloud-hero-box, .cloud-bot-card, .cloud-step-item, .selfhost-terminal-card'
  );

  glowElements.forEach(card => {
    if (card.dataset.glowBound) return;
    card.dataset.glowBound = 'true';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '-999px');
      card.style.setProperty('--mouse-y', '-999px');
    });
  });
}
