'use client';

import React from 'react';
import { User, BadgeQuestionMark, CircleQuestionMark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Section, SectionItem, Loading } from '@/components';
import styles from './ProfilePage.module.css';
import { SUPPORT_URL } from '@/lib/config';

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

  // Get Telegram user photo if available
  const telegramPhotoUrl = isTelegram 
    ? window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url 
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {telegramPhotoUrl ? (
            <img 
              src={telegramPhotoUrl} 
              alt="Avatar" 
              className={styles.avatarImage}
            />
          ) : (
            user.full_name?.charAt(0).toUpperCase() || user.login?.charAt(0).toUpperCase() || '?'
          )}
        </div>
        <h1 className={styles.name}>{user.login}</h1>
      </div>

      <Section>
        <SectionItem
          title="Мой профиль"
          showChevron
          icon={<User size={20} />}
          iconColor="#ff3c00ff"
        />
      </Section>
      <br/>
      <Section>
        <SectionItem
          title="FAQ"
          showChevron
          icon={<CircleQuestionMark size={20} />}
          iconColor="#007aff"
        />
        { SUPPORT_URL && (
        <SectionItem
          title="Поддержка"
          showChevron
          icon={<BadgeQuestionMark size={20} />}
          iconColor="#007aff"
        /> )}
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
