'use client';
import { useCallback, useMemo, useState } from 'react';

import { TablePvContext } from './table-pv-context';
export function TablePvProvider({ children }) {
  const [openDrawerPv, setOpenDrawerPv] = useState(false);

  const onToggleDrawer = useCallback(() => {
    setOpenDrawerPv((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawerPv(false);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      open: openDrawerPv,
      onToggle: onToggleDrawer,
      onClose: onCloseDrawer,
    }),
    [openDrawerPv, onCloseDrawer, onToggleDrawer],
  );

  return <TablePvContext.Provider value={memoizedValue}>{children}</TablePvContext.Provider>;
}
