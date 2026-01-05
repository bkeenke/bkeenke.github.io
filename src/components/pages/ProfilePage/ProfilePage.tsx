'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Section, SectionItem, Button, Loading } from '@/components';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const { user, isLoading, logout, isTelegram } = useAuth();

  if (isLoading) {
    return <Loading text="Загрузка профиля..." />;
  }

  if (!user) {
    return (
      <div className={styles.error}>
        <p>Профиль недоступен</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {user.full_name?.charAt(0).toUpperCase() || user.login?.charAt(0).toUpperCase() || '?'}
        </div>
        <h1 className={styles.name}>{user.full_name || user.login}</h1>
        {user.login && user.full_name && (
          <p className={styles.login}>@{user.login}</p>
        )}
      </div>

      <Section title="Информация">
        <SectionItem
          title="Логин"
          value={user.login || '—'}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          iconColor="#007aff"
        />
        {user.full_name && (
          <SectionItem
            title="Полное имя"
            value={user.full_name}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C14 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
              </svg>
            }
            iconColor="#34c759"
          />
        )}
        {user.balance !== undefined && (
          <SectionItem
            title="Баланс"
            value={`${user.balance.toFixed(2)} ₽`}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.41 18.09V18.67C13.41 19.4 12.81 20 12.08 20H12.07C11.34 20 10.74 19.4 10.74 18.67V18.07C9.41 17.79 8.23 17.06 7.73 15.83C7.5 15.28 7.93 14.67 8.53 14.67H8.77C9.14 14.67 9.44 14.92 9.58 15.27C9.87 16.02 10.63 16.54 12.09 16.54C14.05 16.54 14.49 15.56 14.49 14.95C14.49 14.12 14.05 13.34 11.82 12.81C9.34 12.21 7.64 11.19 7.64 9.14C7.64 7.42 9.03 6.3 10.75 5.93V5.33C10.75 4.6 11.35 4 12.08 4H12.09C12.82 4 13.42 4.6 13.42 5.33V5.95C14.8 6.29 15.67 7.15 16.05 8.21C16.25 8.76 15.83 9.34 15.24 9.34H14.98C14.61 9.34 14.31 9.08 14.21 8.72C13.98 7.96 13.35 7.47 12.09 7.47C10.59 7.47 9.69 8.15 9.69 9.11C9.69 9.95 10.34 10.5 12.36 11.02C14.38 11.54 16.54 12.41 16.54 14.93C16.52 16.76 15.15 17.76 13.41 18.09Z" fill="currentColor"/>
              </svg>
            }
            iconColor="#ff9500"
          />
        )}
      </Section>

      {user.phone && (
        <Section title="Контакты">
          <SectionItem
            title="Телефон"
            value={user.phone}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 4H9L11 9L8.5 10.5C9.57096 12.6715 11.3285 14.429 13.5 15.5L15 13L20 15V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21C14.0993 20.763 10.4202 19.1065 7.65683 16.3432C4.8935 13.5798 3.23705 9.90074 3 6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            iconColor="#5856d6"
          />
        </Section>
      )}

      {isTelegram && (
        <Section>
          <SectionItem
            title="Telegram"
            description="Вы авторизованы через Telegram"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 13.95 10.7 14 10.49C14.0069 10.4582 14.006 10.4252 13.9973 10.3938C13.9886 10.3624 13.9724 10.3337 13.95 10.31C13.89 10.26 13.81 10.28 13.74 10.29C13.65 10.31 12.25 11.24 9.52 13.08C9.12 13.35 8.76 13.49 8.44 13.48C8.08 13.47 7.4 13.28 6.89 13.11C6.26 12.91 5.77 12.8 5.81 12.45C5.83 12.27 6.08 12.09 6.55 11.9C9.47 10.63 11.41 9.79 12.38 9.39C15.16 8.23 15.73 8.03 16.11 8.03C16.19 8.03 16.38 8.05 16.5 8.15C16.6 8.23 16.63 8.34 16.64 8.42C16.63 8.48 16.65 8.66 16.64 8.8Z"/>
              </svg>
            }
            iconColor="#0088cc"
          />
        </Section>
      )}

      <div className={styles.actions}>
        <Button variant="transparent" onClick={handleLogout} fullWidth>
          Выйти из аккаунта
        </Button>
      </div>

      <div className={styles.footer}>
        <p className={styles.version}>Версия 1.0.0</p>
      </div>
    </div>
  );
}

export default ProfilePage;
