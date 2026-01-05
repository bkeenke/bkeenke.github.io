'use client';

import React from 'react';
import { AlertTriangle, Trash2, Ban, Info, HelpCircle, LucideIcon } from 'lucide-react';
import { Button } from '@/components';
import styles from './ConfirmDialog.module.css';

export type ConfirmDialogType = 'danger' | 'warning' | 'info' | 'question';

interface ConfirmDialogProps {
  isOpen: boolean;
  type?: ConfirmDialogType;
  icon?: LucideIcon;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const defaultIcons: Record<ConfirmDialogType, LucideIcon> = {
  danger: Trash2,
  warning: AlertTriangle,
  info: Info,
  question: HelpCircle,
};

const typeColors: Record<ConfirmDialogType, string> = {
  danger: '#ca4040',
  warning: '#ff9f0a',
  info: '#30a2ff',
  question: '#8e8e93',
};

export function ConfirmDialog({
  isOpen,
  type = 'question',
  icon,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const Icon = icon || defaultIcons[type];
  const color = typeColors[type];

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onCancel();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.dialog}>
        <div className={styles.iconWrapper} style={{ backgroundColor: `${color}20` }}>
          <Icon size={32} color={color} />
        </div>
        
        <h3 className={styles.title}>{title}</h3>
        
        {message && <p className={styles.message}>{message}</p>}
        
        <div className={styles.actions}>
          <Button
            variant="secondary"
            fullWidth
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'primary' : 'primary'}
            fullWidth
            loading={loading}
            onClick={onConfirm}
            className={type === 'danger' ? styles.dangerButton : ''}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Hook for easier usage with Telegram WebApp fallback
export function useConfirmDialog() {
  const [dialogState, setDialogState] = React.useState<{
    isOpen: boolean;
    props: Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'>;
    resolve: ((confirmed: boolean) => void) | null;
  }>({
    isOpen: false,
    props: { title: '' },
    resolve: null,
  });

  // Check if Telegram WebApp showConfirm is really available (version >= 6.2)
  const isTelegramConfirmAvailable = React.useMemo(() => {
    try {
      const tg = window.Telegram?.WebApp;
      if (!tg?.showConfirm) return false;
      // showConfirm requires version 6.2+
      const version = tg.version ? parseFloat(tg.version) : 0;
      return version >= 6.2;
    } catch {
      return false;
    }
  }, []);

  const confirm = React.useCallback(
    (props: Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel' | 'loading'>): Promise<boolean> => {
      return new Promise((resolve) => {
        // Try Telegram WebApp first (only if properly supported)
        if (isTelegramConfirmAvailable) {
          try {
            const message = props.message ? `${props.title}\n\n${props.message}` : props.title;
            window.Telegram!.WebApp.showConfirm(message, (confirmed) => {
              resolve(confirmed);
            });
            return;
          } catch {
            // Fall through to custom dialog
          }
        }
        
        // Show custom dialog
        setDialogState({
          isOpen: true,
          props,
          resolve,
        });
      });
    },
    [isTelegramConfirmAvailable]
  );

  const handleConfirm = React.useCallback(() => {
    dialogState.resolve?.(true);
    setDialogState((prev) => ({ ...prev, isOpen: false, resolve: null }));
  }, [dialogState.resolve]);

  const handleCancel = React.useCallback(() => {
    dialogState.resolve?.(false);
    setDialogState((prev) => ({ ...prev, isOpen: false, resolve: null }));
  }, [dialogState.resolve]);

  const DialogComponent = React.useMemo(
    () => (
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        {...dialogState.props}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    ),
    [dialogState.isOpen, dialogState.props, handleConfirm, handleCancel]
  );

  return { confirm, DialogComponent };
}

export default ConfirmDialog;
