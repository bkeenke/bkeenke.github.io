'use client';

import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glass?: boolean;
}

export function Card({ children, className = '', onClick, glass = false }: CardProps) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      className={`${styles.card} ${glass ? styles.glass : ''} ${className}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {children}
    </Component>
  );
}

export default Card;
