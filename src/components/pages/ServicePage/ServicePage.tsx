'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { servicesApi } from '@/lib/api';
import { Section, SectionItem, Loading, Button, useConfirmDialog } from '@/components';
import { useTelegramBackButton } from '@/hooks';
import type { Service } from '@/types';
import styles from './ServicePage.module.css';

function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
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

interface ServicePageProps {
  serviceId: number;
  onBack: () => void;
}

export function ServicePage({ serviceId, onBack }: ServicePageProps) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { confirm, DialogComponent } = useConfirmDialog();
  
  // Use Telegram BackButton if available
  const handleBack = useCallback(() => onBack(), [onBack]);
  const isTelegram = useTelegramBackButton(handleBack);

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try {
      setLoading(true);
      const data = await servicesApi.getUserService(serviceId);
      setService(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки услуги');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!service) return;
    
    const confirmed = await confirm({
      type: 'danger',
      title: 'Удалить услугу?',
      message: 'Это действие нельзя отменить. Услуга будет удалена навсегда.',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
    });
    
    if (!confirmed) return;
    
    try {
      setDeleting(true);
      await servicesApi.deleteUserService(service.user_service_id);
      onBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления услуги');
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loading text="Загрузка услуги..." />;
  }

  if (error || !service) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error || 'Услуга не найдена'}</p>
          <button onClick={onBack} className={styles.backButton}>
            Назад
          </button>
        </div>
      </div>
    );
  }

  const serviceName = service.service?.name || service.name || 'Услуга';
  const serviceCost = service.service?.cost ?? service.cost;

  return (
    <div className={styles.container}>
      {!isTelegram && (
        <div className={styles.header}>
          <button className={styles.backButtonHeader} onClick={onBack}>
            <ChevronLeft size={24} color="#ffffff" />
          </button>
        </div>
      )}

      <div className={styles.statusCard}>
        <div className={styles.statusIcon} style={{ backgroundColor: getStatusColor(service.status) }}>
          {service.status === 'ACTIVE' ? (
            <CheckCircle size={32} color="white" />
          ) : (
            <AlertCircle size={32} color="white" />
          )}
        </div>
        <div className={styles.statusInfo}>
          <span className={styles.statusLabel}>{serviceName}</span>
          <span className={styles.statusValue} style={{ color: getStatusColor(service.status) }}>
            {getStatusText(service.status)}
          </span>
        </div>
      </div>

      <Section title="Информация">
        <SectionItem
          title="ID услуги"
          value={String(service.user_service_id)}
        />
        {service.expire && (
          <SectionItem
            title="Действует до"
            value={formatDate(service.expire)}
          />
        )}
        {service.created && (
          <SectionItem
            title="Дата создания"
            value={formatDate(service.created)}
          />
        )}
        {serviceCost !== undefined && (
          <SectionItem
            title="Стоимость"
            value={`${serviceCost} ₽`}
          />
        )}
        {service.discount !== undefined && service.discount > 0 && (
          <SectionItem
            title="Скидка"
            value={`${service.discount}%`}
          />
        )}
      </Section>

      {service.status === 'BLOCK' && (
        <div className={styles.blockedNotice}>
          <AlertCircle size={20} />
          <p>Услуга заблокирована. Для разблокировки обратитесь в поддержку или пополните баланс.</p>
        </div>
      )}

      {service && service.status !== 'ACTIVE' && (
        <div className={styles.deleteSection}>
          <Button
            variant="secondary"
            fullWidth
            loading={deleting}
            onClick={handleDelete}
          >
            <Trash2 size={18} />
            Удалить услугу
          </Button>
        </div>
      )}

      {DialogComponent}
    </div>
  );
}

export default ServicePage;
