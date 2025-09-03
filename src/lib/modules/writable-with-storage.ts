import { writable, type StartStopNotifier } from 'svelte/store';
import z from 'zod';

export const writableWithStorage = <S extends z.ZodType>(
  key: string,
  storageType: 'local' | 'session',
  zodSchema: S,
  value?: z.infer<S>,
  start?: StartStopNotifier<z.infer<S>>
) => {
  const init = (() => {
    const json =
      storageType === 'local'
        ? localStorage.getItem(key)
        : sessionStorage.getItem(key);
    if (!json) return value;
    try {
      return zodSchema.parse(JSON.parse(json));
    } catch (e) {
      if (e instanceof z.ZodError) {
        console.error(e.name, z.prettifyError(e), ...e.issues);
      } else if (e instanceof Error) {
        console.error(e.name, e.message);
      } else {
        console.error(e);
      }
      return value;
    }
  })();

  const store = writable(init, start);

  store.subscribe((value) => {
    switch (storageType) {
      case 'local': {
        localStorage.setItem(key, JSON.stringify(value));
        return;
      }
      case 'session': {
        sessionStorage.setItem(key, JSON.stringify(value));
        return;
      }
    }
  });

  return store;
};
