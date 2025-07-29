import { lazy } from 'react';

interface LazyOptions {
  maxRetries?: number;
  retryDelay?: number;
}

export function lazyWithRetry<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyOptions = {}
) {
  const { maxRetries = 3, retryDelay = 1000 } = options;

  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attemptImport = (retryCount: number) => {
        importFunc()
          .then(resolve)
          .catch((error) => {
            if (retryCount < maxRetries) {
              setTimeout(() => attemptImport(retryCount + 1), retryDelay);
            } else {
              reject(error);
            }
          });
      };

      attemptImport(0);
    });
  });
}