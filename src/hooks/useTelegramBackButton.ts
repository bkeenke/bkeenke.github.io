'use client';

import { useEffect } from 'react';

/**
 * Hook to handle Telegram WebApp BackButton
 * Returns true if running in Telegram (to hide custom back button)
 */
export function useTelegramBackButton(onBack: () => void): boolean {
  const isTelegram = typeof window !== 'undefined' && 
    !!window.Telegram?.WebApp?.initData && 
    window.Telegram.WebApp.initData.length > 0;

  useEffect(() => {
    if (!isTelegram) return;

    const tg = window.Telegram!.WebApp;
    
    // Show BackButton
    tg.BackButton.show();
    
    // Set click handler
    tg.BackButton.onClick(onBack);

    // Cleanup on unmount
    return () => {
      tg.BackButton.offClick(onBack);
      tg.BackButton.hide();
    };
  }, [isTelegram, onBack]);

  return isTelegram;
}

export default useTelegramBackButton;
