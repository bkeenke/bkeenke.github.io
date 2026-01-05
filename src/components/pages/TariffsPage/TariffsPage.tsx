'use client';

import React, { useEffect, useState } from 'react';
import { servicesApi } from '@/lib/api';
import { Card, Button, Loading, PaymentModal, useToast } from '@/components';
import type { ServiceOrder } from '@/types';
import styles from './TariffsPage.module.css';

export function TariffsPage() {
  const [services, setServices] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceOrder | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await servicesApi.getAvailableServices();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки тарифов');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (service: ServiceOrder) => {
    setSelectedService(service);
  };

  const handlePaymentSuccess = () => {
    setSelectedService(null);
    showToast('Услуга успешно оплачена!', 'success');
    loadServices();
  };

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
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
        <Button onClick={loadServices}>Повторить</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Тарифы</h1>
        <p className={styles.subtitle}>Выберите подходящий тариф</p>
      </div>

      {Object.entries(groupedServices).map(([category, categoryServices]) => (
        <div key={category} className={styles.category}>
          <h2 className={styles.categoryTitle}>{category}</h2>
          <div className={styles.grid}>
            {categoryServices.map((service) => (
              <Card key={service.service_id} className={styles.serviceCard}>
                <div className={styles.serviceHeader}>
                  <h3 className={styles.serviceName}>{service.name}</h3>
                  {service.description && (
                    <p className={styles.serviceDescription}>{service.description}</p>
                  )}
                </div>
                <div className={styles.servicePrice}>
                  <span className={styles.priceAmount}>{service.cost}</span>
                  <span className={styles.priceCurrency}>₽</span>
                  {service.period_cost && (
                    <span className={styles.period}>/ мес</span>
                  )}
                </div>
                <Button
                  fullWidth
                  onClick={() => handleSelectService(service)}
                >
                  Подключить
                </Button>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {services.length === 0 && (
        <div className={styles.empty}>
          <p>Нет доступных тарифов</p>
        </div>
      )}

      {selectedService && (
        <PaymentModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default TariffsPage;
