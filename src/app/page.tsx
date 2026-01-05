'use client';

import { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  TabBar,
  LoginForm,
  Loading,
  HomePage,
  TariffsPage,
  SubscriptionsPage,
  ProfilePage,
  ServicePage,
  TopUpPage,
} from '@/components';
import type { TabType } from '@/types';
import styles from './page.module.css';

export default function Home() {
  const { isAuthenticated, isLoading, isTelegram, telegram } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [topUpAmount, setTopUpAmount] = useState<number | undefined>(undefined);
  const [serviceToOrder, setServiceToOrder] = useState<number | undefined>(undefined);

  const handleTopUp = (amount?: number, serviceId?: number) => {
    setTopUpAmount(amount);
    setServiceToOrder(serviceId);
  };

  const handleCloseTopUp = () => {
    setTopUpAmount(undefined);
    setServiceToOrder(undefined);
  };

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
            <Layers size={64} strokeWidth={1.5} />
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
        {topUpAmount !== undefined ? (
          <TopUpPage 
            onBack={handleCloseTopUp} 
            initialAmount={topUpAmount} 
            serviceToOrder={serviceToOrder}
          />
        ) : selectedServiceId !== null ? (
          <ServicePage 
            serviceId={selectedServiceId} 
            onBack={() => setSelectedServiceId(null)} 
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomePage 
                onServiceSelect={setSelectedServiceId} 
                onTopUp={() => handleTopUp(200)}
              />
            )}
            {activeTab === 'tariffs' && (
              <TariffsPage onTopUp={handleTopUp} />
            )}
            {activeTab === 'subscriptions' && (
              <SubscriptionsPage onServiceSelect={setSelectedServiceId} />
            )}
            {activeTab === 'profile' && <ProfilePage />}
          </>
        )}
      </main>
      
      <TabBar activeTab={activeTab} onTabChange={(tab) => {
        setSelectedServiceId(null);
        setTopUpAmount(undefined);
        setActiveTab(tab);
      }} />
    </div>
  );
}
