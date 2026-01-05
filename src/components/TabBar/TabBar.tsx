'use client';

import React from 'react';
import { Home, Package, Layers, User } from 'lucide-react';
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
    id: 'home',
    label: 'Главная',
    icon: <Home size={24} />,
  },
  {
    id: 'tariffs',
    label: 'Тарифы',
    icon: <Layers size={24} />,
  },
  {
    id: 'subscriptions',
    label: 'Подписки',
    icon: <Package size={24} />,
  },
  {
    id: 'profile',
    label: 'Профиль',
    icon: <User size={24} />,
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
