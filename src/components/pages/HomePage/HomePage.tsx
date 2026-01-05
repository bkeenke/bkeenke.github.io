'use client';

import React, { useEffect, useState } from 'react';
import { Package, ChevronRight, RefreshCw } from 'lucide-react';
import { userApi, servicesApi } from '@/lib/api';
import { Section, SectionItem, Loading, Button } from '@/components';
import type { User, Service } from '@/types';
import styles from './HomePage.module.css';

function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });
}

function getStatusText(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'Активна';
    case 'BLOCK':
      return 'Заблокирована';
    case 'NOT PAID':
      return 'Не оплачена';
    default:
      return 'Неизвестно';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return '#34c759';
    case 'BLOCK':
      return '#ca4040';
    case 'NOT PAID':
      return '#30a2ff';
    default:
      return '#8e8e93';
  }
}

interface HomePageProps {
  onServiceSelect?: (serviceId: number) => void;
  onTopUp?: () => void;
}

export function HomePage({ onServiceSelect, onTopUp }: HomePageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userData, servicesData] = await Promise.all([
        userApi.getProfile(),
        servicesApi.getUserServices(),
      ]);
      setUser(userData);
      setServices(servicesData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Загрузка..." />;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={loadData} className={styles.retryButton}>
          <RefreshCw size={16} />
          Повторить
        </button>
      </div>
    );
  }

  const activeServices = services.filter((s) => s.status === 'ACTIVE');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
      </div>

      <div className={styles.balanceCard}>
        <div className={styles.balanceInfo}>
          <span className={styles.balanceLabel}>Баланс</span>
          <span className={styles.balanceAmount}>
            {user?.balance?.toFixed(2) || '0.00'} ₽
          </span>
        </div>
        <Button variant="primary" onClick={onTopUp}>
          Пополнить
        </Button>
      </div>

      {activeServices.length > 0 && (
        <Section title="Активные услуги">
          {activeServices.slice(0, 3).map((service) => (
            <SectionItem
              key={service.user_service_id}
              title={service.service?.name || service.name || 'Услуга'}
              description={`До ${formatDate(service.expire)}`}
              icon={<Package size={20} />}
              iconColor={getStatusColor(service.status)}
              showChevron
              onClick={() => onServiceSelect?.(service.user_service_id)}
              value={
                <span style={{ color: getStatusColor(service.status) }}>
                  {getStatusText(service.status)}
                </span>
              }
            />
          ))}
          {activeServices.length > 3 && (
            <div className={styles.moreServices}>
              <ChevronRight size={16} />
              <span>Ещё {activeServices.length - 3} услуг</span>
            </div>
          )}
        </Section>
      )}

      {services.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <Package size={48} strokeWidth={1.5} />
          </div>
          <p className={styles.emptyText}>У вас пока нет услуг</p>
          <p className={styles.emptyHint}>Перейдите в раздел «Тарифы» чтобы выбрать услугу</p>
        </div>
      )}
    </div>
  );
}

export default HomePage;
