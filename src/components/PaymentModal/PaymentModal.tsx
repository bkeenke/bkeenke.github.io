'use client';

import React, { useState, useEffect } from 'react';
import { paymentApi } from '@/lib/api';
import { Button, Loading } from '@/components';
import type { PaySystem, ServiceOrder } from '@/types';
import styles from './PaymentModal.module.css';

interface PaymentModalProps {
  service: ServiceOrder;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ service, onClose, onSuccess }: PaymentModalProps) {
  const [paySystems, setPaySystems] = useState<PaySystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPaySystem, setSelectedPaySystem] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaySystems();
  }, []);

  const loadPaySystems = async () => {
    try {
      setLoading(true);
      const data = await paymentApi.getPaySystems();
      setPaySystems(data);
      if (data.length > 0) {
        setSelectedPaySystem(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки платёжных систем');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPaySystem) return;

    try {
      setProcessing(true);
      const result = await paymentApi.createPayment(selectedPaySystem, service.cost);
      
      // Если есть URL для оплаты - переходим на него
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      } else {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка оплаты');
      setProcessing(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Оплата</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.serviceInfo}>
            <h3 className={styles.serviceName}>{service.name}</h3>
            {service.description && (
              <p className={styles.serviceDescription}>{service.description}</p>
            )}
            <div className={styles.price}>
              <span className={styles.priceValue}>{service.cost} ₽</span>
              {service.period_cost && (
                <span className={styles.pricePeriod}>/ мес</span>
              )}
            </div>
          </div>

          {loading ? (
            <Loading text="Загрузка способов оплаты..." />
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <div className={styles.paySystemsList}>
              <p className={styles.paySystemsTitle}>Способ оплаты</p>
              {paySystems.map((ps) => (
                <button
                  key={ps.id}
                  className={`${styles.paySystemItem} ${selectedPaySystem === ps.id ? styles.selected : ''}`}
                  onClick={() => setSelectedPaySystem(ps.id)}
                >
                  <div className={styles.radio}>
                    {selectedPaySystem === ps.id && <div className={styles.radioInner} />}
                  </div>
                  <span className={styles.paySystemName}>{ps.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Button
            variant="glow"
            fullWidth
            onClick={handlePayment}
            loading={processing}
            disabled={!selectedPaySystem || loading}
          >
            Оплатить {service.cost} ₽
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
