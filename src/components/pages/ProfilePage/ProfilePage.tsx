'use client';

import React from 'react';
import { User, UserCircle, Wallet, Phone, Send } from 'lucide-react';
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
          icon={<User size={20} />}
          iconColor="#007aff"
        />
        {user.full_name && (
          <SectionItem
            title="Полное имя"
            value={user.full_name}
            icon={<UserCircle size={20} />}
            iconColor="#34c759"
          />
        )}
        {user.balance !== undefined && (
          <SectionItem
            title="Баланс"
            value={`${user.balance.toFixed(2)} ₽`}
            icon={<Wallet size={20} />}
            iconColor="#ff9500"
          />
        )}
      </Section>
      
      {/* <div className={styles.actions}>
        <Button variant="transparent" onClick={handleLogout} fullWidth>
          Выйти из аккаунта
        </Button>
      </div> */}

      <div className={styles.footer}>
        <p className={styles.version}>Версия 1.0.0</p>
      </div>
    </div>
  );
}

export default ProfilePage;
