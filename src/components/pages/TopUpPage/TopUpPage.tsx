'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { paymentApi, servicesApi } from '@/lib/api';
import { PAYMENT_LINK_OUT } from '@/lib/config';
import { Button, Loading } from '@/components';
import { useTelegramBackButton } from '@/hooks';
import type { PaySystem, Forecast } from '@/types';
import styles from './TopUpPage.module.css';

interface TopUpPageProps {
  onBack: () => void;
  initialAmount?: number;
  serviceToOrder?: number;
}

const PRESET_AMOUNTS = [100, 200, 500, 1000];

export function TopUpPage({ onBack, initialAmount, serviceToOrder }: TopUpPageProps) {
  const [paySystems, setPaySystems] = useState<PaySystem[]>([]);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPaySystem, setSelectedPaySystem] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(initialAmount || 0);
  const [customAmount, setCustomAmount] = useState<string>(initialAmount ? String(initialAmount) : '');
  const [error, setError] = useState<string | null>(null);
  const [paymentIframeUrl, setPaymentIframeUrl] = useState<string | null>(null);
  
  // Use Telegram BackButton if available
  const handleBack = useCallback(() => onBack(), [onBack]);
  const isTelegram = useTelegramBackButton(handleBack);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paySystemsData, forecastData] = await Promise.all([
        paymentApi.getPaySystems(),
        paymentApi.getForecast(),
      ]);
      
      setPaySystems(paySystemsData);
      setForecast(forecastData);
      
      if (paySystemsData.length > 0) {
        setSelectedPaySystem(paySystemsData[0].paysystem);
      }
      
      // If no initial amount passed, calculate from forecast
      if (!initialAmount && forecastData) {
        const requiredAmount = Math.ceil(forecastData.total - forecastData.balance - forecastData.bonuses);
        if (requiredAmount > 0) {
          setAmount(requiredAmount);
          setCustomAmount(String(requiredAmount));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  // Check if there are unpaid services
  const hasDebt = forecast && forecast.items.some(item => item.status === 'NOT PAID');
  const debtAmount = forecast ? Math.ceil(forecast.total - forecast.balance - forecast.bonuses) : 0;
  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCustomAmount(value);
    if (value) {
      setAmount(parseInt(value, 10));
    }
  };

  const handlePayment = async () => {
    if (!selectedPaySystem || amount <= 0) return;

    const paySystem = paySystems.find(ps => ps.paysystem === selectedPaySystem);
    if (!paySystem?.shm_url) {
      setError('Платёжная система недоступна');
      return;
    }

    setProcessing(true);
    setError(null);

    // Order service before payment if serviceToOrder is specified
    if (serviceToOrder) {
      try {
        await servicesApi.orderService(serviceToOrder);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка заказа услуги');
        setProcessing(false);
        return;
      }
    }

    const paymentUrl = paySystem.shm_url + amount;
    
    // If PAYMENT_LINK_OUT is false, open in iframe
    if (PAYMENT_LINK_OUT === 'false') {
      setPaymentIframeUrl(paymentUrl);
      setProcessing(false);
    } else {
      // Open in external browser via Telegram WebApp
      if (window.Telegram?.WebApp?.openLink) {
        window.Telegram.WebApp.openLink(paymentUrl, { try_instant_view: false });
      } else {
        window.open(paymentUrl, '_blank');
      }
      setProcessing(false);
    }
  };

  const handleCloseIframe = () => {
    setPaymentIframeUrl(null);
    // Reload data to check if payment was successful
    loadData();
  };

  if (loading) {
    return <Loading text="Загрузка..." />;
  }

  // Show payment iframe
  if (paymentIframeUrl) {
    return (
      <div className={styles.iframeContainer}>
        <div className={styles.iframeHeader}>
          <button className={styles.closeButton} onClick={handleCloseIframe}>
            <X size={24} color="#ffffff" />
          </button>
          <span className={styles.iframeTitle}>Оплата</span>
        </div>
        <iframe
          src={paymentIframeUrl}
          className={styles.paymentIframe}
          title="Оплата"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
        />
      </div>
    );
  }

  // Show preset amounts only if no debt and no initial amount
  const showPresets = !hasDebt && !initialAmount;

  return (
    <div className={styles.container}>
      {!isTelegram && (
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onBack}>
            <ChevronLeft size={24} color="#ffffff" />
          </button>
        </div>
      )}

      {error && (
        <div className={styles.errorNotice}>
          <p>{error}</p>
        </div>
      )}

      {hasDebt && debtAmount > 0 && (
        <div className={styles.debtNotice}>
          <p>У вас есть неоплаченные услуги</p>
          <p className={styles.debtAmount}>К оплате: {debtAmount} ₽</p>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Сумма пополнения</h3>
        {showPresets && (
          <div className={styles.presetAmounts}>
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                className={`${styles.presetButton} ${amount === preset && !customAmount ? styles.selected : ''}`}
                onClick={() => handleAmountSelect(preset)}
              >
                {preset} ₽
              </button>
            ))}
          </div>
        )}
        <div className={styles.customAmount}>
          <input
            type="text"
            inputMode="numeric"
            placeholder={showPresets ? "Другая сумма" : "Сумма"}
            value={customAmount}
            onChange={handleCustomAmountChange}
            className={styles.amountInput}
          />
          <span className={styles.currency}>₽</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Способ оплаты</h3>
        <div className={styles.paySystemsList}>
          {paySystems.map((ps) => (
            <button
              key={ps.paysystem}
              className={`${styles.paySystemItem} ${selectedPaySystem === ps.paysystem ? styles.selected : ''}`}
              onClick={() => setSelectedPaySystem(ps.paysystem)}
            >
              <div className={styles.radio}>
                {selectedPaySystem === ps.paysystem && <div className={styles.radioInner} />}
              </div>
              <span className={styles.paySystemName}>{ps.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          fullWidth
          loading={processing}
          disabled={!selectedPaySystem || amount <= 0}
          onClick={handlePayment}
        >
          Оплатить {amount > 0 ? `${amount} ₽` : ''}
        </Button>
      </div>
    </div>
  );
}

export default TopUpPage;
