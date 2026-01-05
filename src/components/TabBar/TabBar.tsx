'use client';

import React from 'react';
import type { TabType } from '@/types';
import styles from './TabBar.module.css';

interface TabItem {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tabId: TabType) => void;
}

const defaultTabs: TabItem[] = [
  {
    id: 'tariffs',
    label: 'Тарифы',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'subscriptions',
    label: 'Подписки',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Профиль',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className={styles.tabBar}>
      <div className={styles.tabBarContainer}>
        {defaultTabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBarItem} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <div className={styles.icon}>{tab.icon}</div>
            <span className={styles.text}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TabBar;
