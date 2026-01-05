'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  TabBar,
  LoginForm,
  Loading,
  TariffsPage,
  SubscriptionsPage,
  ProfilePage,
} from '@/components';
import type { TabType } from '@/types';
import styles from './page.module.css';

export default function Home() {
  const { isAuthenticated, isLoading, isTelegram, telegram } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('tariffs');

  // Telegram WebApp ready
  useEffect(() => {
    if (telegram) {
      telegram.ready();
      telegram.expand();
      
      // Set header color
      if (telegram.setHeaderColor) {
        telegram.setHeaderColor('#000000');
      }
      if (telegram.setBackgroundColor) {
        telegram.setBackgroundColor('#000000');
      }
    }
  }, [telegram]);

  // Show loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <Loading text="Загрузка..." />
      </div>
    );
  }

  // Show login form if not authenticated and not in Telegram
  if (!isAuthenticated && !isTelegram) {
    return (
      <div className={styles.container}>
        <div className={styles.loginWrapper}>
          <div className={styles.logo}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className={styles.title}>BK Cloud</h1>
          <p className={styles.subtitle}>Войдите в аккаунт для продолжения</p>
          <LoginForm />
        </div>
      </div>
    );
  }

  // Main app with tabs
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {activeTab === 'tariffs' && <TariffsPage />}
        {activeTab === 'subscriptions' && <SubscriptionsPage />}
        {activeTab === 'profile' && <ProfilePage />}
      </main>
      
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
