import { useSyncExternalStore } from 'react';

let actual = null;
const listeners = new Set();

export function setActual(a) {
  actual = a;
  listeners.forEach((l) => l());
}

export function useActual() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => actual
  );
}
