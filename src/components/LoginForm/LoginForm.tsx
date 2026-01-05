'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const { login, register, canRegister, isLoading, error } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim() || !password.trim()) {
      setLocalError('Заполните все поля');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setLocalError('Пароли не совпадают');
        return;
      }
      if (password.length < 6) {
        setLocalError('Пароль должен быть не менее 6 символов');
        return;
      }
    }

    try {
      if (mode === 'login') {
        await login(username, password);
      } else {
        await register(username, password);
      }
    } catch {
      // Error is handled by context
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {mode === 'login' ? 'Вход' : 'Регистрация'}
        </h1>
        <p className={styles.subtitle}>
          {mode === 'login' 
            ? 'Войдите в свой аккаунт' 
            : 'Создайте новый аккаунт'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            autoComplete="username"
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </div>

        {mode === 'register' && (
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              autoComplete="new-password"
            />
          </div>
        )}

        {(localError || error) && (
          <div className={styles.error}>{localError || error}</div>
        )}

        <Button 
          type="submit" 
          fullWidth 
          loading={isLoading}
        >
          {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </Button>
      </form>

      {canRegister && (
        <div className={styles.switchMode}>
          {mode === 'login' ? (
            <p>
              Нет аккаунта?{' '}
              <button 
                type="button" 
                onClick={() => setMode('register')}
                className={styles.switchButton}
              >
                Зарегистрируйтесь
              </button>
            </p>
          ) : (
            <p>
              Уже есть аккаунт?{' '}
              <button 
                type="button" 
                onClick={() => setMode('login')}
                className={styles.switchButton}
              >
                Войдите
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default LoginForm;
