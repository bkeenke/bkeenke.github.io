'use client';

import React from 'react';
import styles from './Loading.module.css';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export function Loading({ text, fullScreen = false }: LoadingProps) {
  return (
    <div className={`${styles.container} ${fullScreen ? styles.fullScreen : ''}`}>
      <div className={styles.spinner} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}

export default Loading;
