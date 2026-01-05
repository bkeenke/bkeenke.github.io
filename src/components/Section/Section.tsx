'use client';

import React from 'react';
import styles from './Section.module.css';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, children, className = '' }: SectionProps) {
  return (
    <div className={`${styles.sectionWrapper} ${className}`}>
      {title && <h3 className={styles.sectionTitle}>{title}</h3>}
      <div className={styles.section}>{children}</div>
    </div>
  );
}

interface SectionItemProps {
  icon?: React.ReactNode;
  iconColor?: string;
  title: string;
  description?: string;
  value?: React.ReactNode;
  onClick?: () => void;
  showChevron?: boolean;
  danger?: boolean;
  children?: React.ReactNode;
}

export function SectionItem({
  icon,
  iconColor,
  title,
  description,
  value,
  onClick,
  showChevron = false,
  danger = false,
  children,
}: SectionItemProps) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      className={`${styles.sectionItem} ${description ? styles.withDescription : ''} ${danger ? styles.danger : ''}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {icon && (
        <div className={styles.icon} style={iconColor ? { background: iconColor } : undefined}>
          {icon}
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
      <div className={styles.right}>
        {value && <span className={styles.value}>{value}</span>}
        {children}
        {showChevron && (
          <span className={styles.chevron}>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </div>
    </Component>
  );
}

export default Section;
