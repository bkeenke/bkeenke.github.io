'use client';

import React, { useEffect, useState } from 'react';
import { servicesApi } from '@/lib/api';
import { Section, SectionItem, Loading } from '@/components';
import type { Service } from '@/types';
import styles from './SubscriptionsPage.module.css';

function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getStatusText(status: number): string {
  switch (status) {
    case 1:
      return 'Активна';
    case 0:
      return 'Отключена';
    case -1:
      return 'Заблокирована';
    default:
      return 'Неизвестно';
  }
}

function getStatusColor(status: number): string {
  switch (status) {
    case 1:
      return '#34c759';
    case 0:
      return '#ff9500';
    case -1:
      return '#ff3b30';
    default:
      return '#8e8e93';
  }
}

export function SubscriptionsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await servicesApi.getUserServices();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки подписок');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Загрузка подписок..." />;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={loadServices} className={styles.retryButton}>
          Повторить
        </button>
      </div>
    );
  }

  const activeServices = services.filter((s) => s.status === 1);
  const inactiveServices = services.filter((s) => s.status !== 1);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Подписки</h1>
        <p className={styles.subtitle}>Управляйте своими услугами</p>
      </div>

      {activeServices.length > 0 && (
        <Section title="Активные">
          {activeServices.map((service) => (
            <SectionItem
              key={service.user_service_id}
              title={service.name}
              description={`До ${formatDate(service.expire)}`}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              iconColor="#34c759"
              showChevron
              value={
                <span style={{ color: getStatusColor(service.status) }}>
                  {getStatusText(service.status)}
                </span>
              }
            />
          ))}
        </Section>
      )}

      {inactiveServices.length > 0 && (
        <Section title="Неактивные">
          {inactiveServices.map((service) => (
            <SectionItem
              key={service.user_service_id}
              title={service.name}
              description={service.expire ? `Истекла ${formatDate(service.expire)}` : undefined}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              iconColor="#8e8e93"
              showChevron
              value={
                <span style={{ color: getStatusColor(service.status) }}>
                  {getStatusText(service.status)}
                </span>
              }
            />
          ))}
        </Section>
      )}

      {services.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className={styles.emptyText}>У вас пока нет подписок</p>
          <p className={styles.emptyHint}>Перейдите в раздел «Тарифы» чтобы выбрать услугу</p>
        </div>
      )}
    </div>
  );
}

export default SubscriptionsPage;
