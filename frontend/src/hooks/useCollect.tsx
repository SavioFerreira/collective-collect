import { useContext } from 'react';

import { CollectContext } from '@contexts/CollectContext';

export function useCollect() {
  const context = useContext(CollectContext);

  return context;
}