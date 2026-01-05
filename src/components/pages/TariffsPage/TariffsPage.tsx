'use client';

import React, { useEffect, useState } from 'react';
import { servicesApi, paymentApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Button, Loading, useToast, useConfirmDialog } from '@/components';
import type { ServiceOrder, Forecast } from '@/types';
import styles from './TariffsPage.module.css';

interface TariffsPageProps {
  onTopUp?: (amount?: number, serviceToOrder?: number) => void;
}

export function TariffsPage({ onTopUp }: TariffsPageProps) {
  const [services, setServices] = useState<ServiceOrder[]>([]);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderingId, setOrderingId] = useState<number | null>(null);
  const { showToast } = useToast();
  const { user, refreshUser } = useAuth();
  const { confirm, DialogComponent } = useConfirmDialog();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesData, forecastData] = await Promise.all([
        servicesApi.getAvailableServices(),
        paymentApi.getForecast(),
      ]);
      setServices(servicesData);
      setForecast(forecastData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки тарифов');
    } finally {
      setLoading(false);
    }
  };

  // Check if there are unpaid services
  const hasDebt = forecast && forecast.items.some(item => item.status === 'NOT PAID');
  const debtAmount = forecast ? Math.ceil(forecast.total - forecast.balance - forecast.bonuses) : 0;

  const handleSelectService = async (service: ServiceOrder) => {
    // If has debt, redirect to payment page instead of ordering
    if (hasDebt && debtAmount > 0) {
      onTopUp?.(debtAmount);
      return;
    }

    const balance = user?.balance || 0;
    
    if (balance >= service.cost) {
      // Достаточно денег - спрашиваем подтверждение
      const confirmed = await confirm({
        type: 'info',
        title: 'Подключить услугу?',
        message: `С вашего баланса будет списано ${service.cost} ₽`,
        confirmText: 'Подключить',
        cancelText: 'Отмена',
      });
      
      if (!confirmed) return;
      
      try {
        setOrderingId(service.service_id);
        await servicesApi.orderService(service.service_id);
        showToast('Услуга успешно подключена!', 'success');
        await refreshUser();
        await loadData();
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Ошибка заказа', 'error');
      } finally {
        setOrderingId(null);
      }
    } else {
      // Недостаточно денег - открываем страницу пополнения с ID услуги для заказа после оплаты
      const requiredAmount = Math.ceil(service.cost - balance);
      onTopUp?.(requiredAmount, service.service_id);
    }
  };

  // Group services by category and sort by cost
  const groupedServices = services
    .slice()
    .sort((a, b) => a.cost - b.cost)
    .reduce((acc, service) => {
      const category = service.category || 'Другое';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {} as Record<string, ServiceOrder[]>);

  if (loading) {
    return <Loading text="Загрузка тарифов..." />;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <Button onClick={loadData}>Повторить</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {hasDebt && debtAmount > 0 && (
        <div className={styles.debtBanner}>
          <p>У вас есть неоплаченные услуги</p>
          <Button onClick={() => onTopUp?.(debtAmount)}>
            Оплатить {debtAmount} ₽
          </Button>
        </div>
      )}
      <div className={styles.header}>
        <h1 className={styles.title}>Тарифы</h1>
        {user?.balance !== undefined && (
          <p className={styles.balance}>Баланс: {user.balance} ₽</p>
        )}
      </div>

      {Object.entries(groupedServices).map(([category, categoryServices]) => (
        <div key={category} className={styles.category}>
          <div className={styles.grid}>
            {categoryServices.map((service) => {
              const canAfford = (user?.balance || 0) >= service.cost;
              return (
                <Card key={service.service_id} className={styles.serviceCard}>
                  <div className={styles.serviceHeader}>
                    <h3 className={styles.serviceName}>{service.name}</h3>
                    {service.descr && (
                      <p className={styles.serviceDescription}>{service.descr}</p>
                    )}
                  </div>
                  <div className={styles.servicePrice}>
                    <span className={styles.priceAmount}>{service.cost}</span>
                    <span className={styles.priceCurrency}>₽</span>
                    {service.period && service.period > 0 && (
                      <span className={styles.period}>/ {service.period} мес</span>
                    )}
                  </div>
                  <Button
                    fullWidth
                    loading={orderingId === service.service_id}
                    onClick={() => handleSelectService(service)}
                  >
                    {canAfford ? 'Подключить' : 'Пополнить и подключить'}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {services.length === 0 && (
        <div className={styles.empty}>
          <p>Нет доступных тарифов</p>
        </div>
      )}
      
      {DialogComponent}
    </div>
  );
}

export default TariffsPage;
