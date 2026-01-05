// Инициализация Telegram Web App
const tg = window.Telegram?.WebApp;

// Применяем тему Telegram если доступна
if (tg) {
    tg.ready();
    tg.expand();
    
    // Применяем цвета темы Telegram
    if (tg.themeParams) {
        const root = document.documentElement;
        if (tg.themeParams.bg_color) {
            root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
        }
        if (tg.themeParams.text_color) {
            root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
        }
        if (tg.themeParams.hint_color) {
            root.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color);
        }
        if (tg.themeParams.link_color) {
            root.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color);
        }
        if (tg.themeParams.button_color) {
            root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
        }
        if (tg.themeParams.button_text_color) {
            root.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
        }
        if (tg.themeParams.secondary_bg_color) {
            root.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color);
        }
    }
}

// Данные пользователя из Telegram
const user = tg?.initDataUnsafe?.user || {
    first_name: 'Гость',
    username: 'guest'
};

// Контент страниц
const pages = {
    tariffs: `
        <h1 class="page-title">Тарифы</h1>
        <p class="page-subtitle">Выберите подходящий тариф</p>
        <div class="empty-state">
            <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <p class="empty-state-text">Тарифы скоро появятся</p>
        </div>
    `,
    subscriptions: `
        <h1 class="page-title">Подписки</h1>
        <p class="page-subtitle">Ваши активные подписки</p>
        <div class="empty-state">
            <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            <p class="empty-state-text">У вас пока нет подписок</p>
        </div>
    `,
    profile: `
        <h1 class="page-title">Профиль</h1>
        <div class="profile-header">
            <div class="profile-avatar">${user.first_name.charAt(0).toUpperCase()}</div>
            <div class="profile-name">${user.first_name}${user.last_name ? ' ' + user.last_name : ''}</div>
            ${user.username ? `<div class="profile-username">@${user.username}</div>` : ''}
        </div>
        <div class="empty-state">
            <p class="empty-state-text">Настройки профиля скоро появятся</p>
        </div>
    `
};

// DOM элементы
const content = document.getElementById('content');
const navItems = document.querySelectorAll('.nav-item');

// Текущая вкладка
let currentTab = 'tariffs';

// Функция переключения вкладок
function switchTab(tab) {
    if (tab === currentTab) return;
    
    currentTab = tab;
    
    // Обновляем активную кнопку навигации
    navItems.forEach(item => {
        if (item.dataset.tab === tab) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Обновляем контент
    content.innerHTML = `<div class="page active">${pages[tab]}</div>`;
    
    // Хаптик фидбек в Telegram
    if (tg?.HapticFeedback) {
        tg.HapticFeedback.selectionChanged();
    }
}

// Обработчики навигации
navItems.forEach(item => {
    item.addEventListener('click', () => {
        switchTab(item.dataset.tab);
    });
});

// Инициализация - показываем первую вкладку
switchTab('tariffs');
