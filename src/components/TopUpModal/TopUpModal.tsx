'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { paymentApi } from '@/lib/api';
import { Button, Loading } from '@/components';
import type { PaySystem } from '@/types';
import styles from './TopUpModal.module.css';

interface TopUpModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PRESET_AMOUNTS = [100, 200, 500, 1000];

export function TopUpModal({ onClose, onSuccess }: TopUpModalProps) {
  const [paySystems, setPaySystems] = useState<PaySystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPaySystem, setSelectedPaySystem] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(200);
  const [customAmount, setCustomAmount] = useState<string>('');
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

    try {
      setProcessing(true);
      const result = await paymentApi.createPayment(amount, selectedPaySystem);
      
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
          <h2 className={styles.title}>Пополнение баланса</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.amountSection}>
            <p className={styles.label}>Сумма пополнения</p>
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
            <div className={styles.customAmount}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Другая сумма"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className={styles.amountInput}
              />
              <span className={styles.currency}>₽</span>
            </div>
          </div>

          {loading ? (
            <Loading text="Загрузка способов оплаты..." />
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <div className={styles.paySystemsList}>
              <p className={styles.label}>Способ оплаты</p>
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
            fullWidth
            loading={processing}
            disabled={!selectedPaySystem || amount <= 0 || loading}
            onClick={handlePayment}
          >
            Оплатить {amount > 0 ? `${amount} ₽` : ''}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TopUpModal;
