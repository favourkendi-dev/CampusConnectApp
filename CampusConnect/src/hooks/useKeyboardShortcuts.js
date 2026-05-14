import { useEffect, useCallback } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;
    const alt = e.altKey;

    Object.entries(shortcuts).forEach(([combo, action]) => {
      const parts = combo.toLowerCase().split('+');
      const needsCtrl = parts.includes('ctrl') || parts.includes('cmd');
      const needsShift = parts.includes('shift');
      const needsAlt = parts.includes('alt');
      const targetKey = parts.find((p) => !['ctrl', 'cmd', 'shift', 'alt'].includes(p));

      if (
        ctrl === needsCtrl &&
        shift === needsShift &&
        alt === needsAlt &&
        key === targetKey
      ) {
        e.preventDefault();
        action();
      }
    });
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};