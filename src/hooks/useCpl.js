import { useContext } from 'react';
import { CplContext } from '../context/cpl-context';

export function useCpl() {
  const context = useContext(CplContext);

  if (!context) {
    throw new Error('useCpl must be used within a CplProvider');
  }

  return context;
}
