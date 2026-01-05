// Telegram Web App
const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#181818');
    tg.setBackgroundColor('#181818');
}

// User data
const user = tg?.initDataUnsafe?.user || {
    first_name: 'Bkeenke',
    last_name: '',
    username: 'bkeenke',
    photo_url: null
};

// Icons
const icons = {
    user: `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
    upgrade: `<svg viewBox="0 0 24 24"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>`,
    link: `<svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`,
    community: `<svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
    settings: `<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`,
    web: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
    arrow: `<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>`
};

// Get user initials
function getInitials(name) {
    return name.charAt(0).toUpperCase();
}

// Get avatar HTML
function getAvatarContent(size = 'large') {
    if (user.photo_url) {
        return `<img src="${user.photo_url}" alt="">`;
    }
    return getInitials(user.first_name);
}

// Pages content
const pages = {
    profile: () => `
        <div class="page">
            <div class="profile-header">
                <div class="profile-avatar">${getAvatarContent()}</div>
                <div class="profile-name">${user.first_name}${user.last_name ? ' ' + user.last_name : ''}</div>
            </div>
            
            <div class="menu-section">
                <div class="menu-card">
                    <div class="menu-item" onclick="menuAction('profile')">
                        <div class="menu-icon red">${icons.user}</div>
                        <span class="menu-text">Мой профиль</span>
                        <span class="menu-arrow">${icons.arrow}</span>
                    </div>
                </div>
                
                <div class="menu-card">
                    <div class="menu-item" onclick="menuAction('upgrade')">
                        <div class="menu-icon green">${icons.upgrade}</div>
                        <span class="menu-text">Апгрейд</span>
                        <span class="menu-arrow">${icons.arrow}</span>
                    </div>
                    <div class="menu-item" onclick="menuAction('referral')">
                        <div class="menu-icon cyan">${icons.link}</div>
                        <span class="menu-text">Ссылка обмена</span>
                        <span class="menu-arrow">${icons.arrow}</span>
                    </div>
                    <div class="menu-item" onclick="menuAction('community')">
                        <div class="menu-icon pink">${icons.community}</div>
                        <span class="menu-text">Сообщество BK Cloud</span>
                        <span class="menu-arrow">${icons.arrow}</span>
                    </div>
                    <div class="menu-item" onclick="menuAction('settings')">
                        <div class="menu-icon gray">${icons.settings}</div>
                        <span class="menu-text">Настройки</span>
                        <span class="menu-arrow">${icons.arrow}</span>
                    </div>
                    <div class="menu-item" onclick="openWebsite()">
                        <div class="menu-icon blue">${icons.web}</div>
                        <span class="menu-text">Открыть сайт BK Cloud</span>
                        <span class="menu-arrow">${icons.arrow}</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    tariffs: () => `
        <div class="page">
            <div class="page-header">
                <h1 class="page-title">Тарифы</h1>
                <p class="page-subtitle">Выберите подходящий план</p>
            </div>
            
            <div class="tariff-card">
                <div class="tariff-header">
                    <span class="tariff-name">Базовый</span>
                    <span class="tariff-badge">Текущий</span>
                </div>
                <div class="tariff-price">Бесплатно</div>
                <ul class="tariff-features">
                    <li>1 ГБ хранилища</li>
                    <li>Базовая поддержка</li>
                    <li>Доступ к API</li>
                </ul>
                <button class="btn btn-secondary">Текущий план</button>
            </div>
            
            <div class="tariff-card">
                <div class="tariff-header">
                    <span class="tariff-name">Премиум</span>
                </div>
                <div class="tariff-price">299 ₽ <span>/ месяц</span></div>
                <ul class="tariff-features">
                    <li>100 ГБ хранилища</li>
                    <li>Приоритетная поддержка</li>
                    <li>Расширенный API</li>
                    <li>Без рекламы</li>
                </ul>
                <button class="btn btn-primary" onclick="selectTariff('premium')">Выбрать</button>
            </div>
            
            <div class="tariff-card">
                <div class="tariff-header">
                    <span class="tariff-name">Бизнес</span>
                </div>
                <div class="tariff-price">999 ₽ <span>/ месяц</span></div>
                <ul class="tariff-features">
                    <li>Безлимитное хранилище</li>
                    <li>24/7 поддержка</li>
                    <li>Полный доступ к API</li>
                    <li>Командный доступ</li>
                    <li>Аналитика</li>
                </ul>
                <button class="btn btn-primary" onclick="selectTariff('business')">Выбрать</button>
            </div>
        </div>
    `,
    
    subscriptions: () => `
        <div class="page">
            <div class="page-header">
                <h1 class="page-title">Подписки</h1>
                <p class="page-subtitle">Ваши активные подписки</p>
            </div>
            
            <div class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                </svg>
                <p class="empty-text">У вас пока нет активных подписок</p>
            </div>
        </div>
    `
};

// DOM
const content = document.getElementById('content');
const navItems = document.querySelectorAll('.nav-item');
const navAvatar = document.getElementById('navAvatar');

// Set nav avatar
if (navAvatar) {
    navAvatar.innerHTML = getAvatarContent('small');
}

// Current tab
let currentTab = 'profile';

// Switch tab
function switchTab(tab) {
    if (tab === currentTab) return;
    
    currentTab = tab;
    
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.tab === tab);
    });
    
    content.innerHTML = pages[tab]();
    content.scrollTop = 0;
    
    if (tg?.HapticFeedback) {
        tg.HapticFeedback.selectionChanged();
    }
}

// Menu action handler
function menuAction(action) {
    if (tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    if (tg?.showAlert) {
        tg.showAlert(`${action} - скоро будет доступно!`);
    } else {
        alert(`${action} - скоро будет доступно!`);
    }
}

// Open website
function openWebsite() {
    if (tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    const url = 'https://bkcloud.io';
    if (tg?.openLink) {
        tg.openLink(url);
    } else {
        window.open(url, '_blank');
    }
}

// Select tariff
function selectTariff(tariff) {
    if (tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    
    if (tg?.showConfirm) {
        tg.showConfirm(`Выбрать тариф "${tariff}"?`, (confirmed) => {
            if (confirmed) {
                tg.showAlert('Функция оплаты скоро будет доступна!');
            }
        });
    } else {
        alert(`Тариф ${tariff} выбран!`);
    }
}

// Navigation handlers
navItems.forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
});

// Init
switchTab('profile');
