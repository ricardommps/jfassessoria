'use client';

import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------

export const TablePvContext = createContext({});

export const useTablePvContext = () => {
  const context = useContext(TablePvContext);

  if (!context) throw new Error('useTablePvContext must be use inside TablePvContext');

  return context;
};
