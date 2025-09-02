import { z } from 'zod';
import { pgConfSchema, storageKeys, type PageConfig } from './decl';

const initial = (): PageConfig => {
  const _init: PageConfig = {
    colorScheme: 'light',
  };

  const json = localStorage.getItem(storageKeys.pageConfig);
  if (!json) return _init;
  try {
    return pgConfSchema.parse(JSON.parse(json));
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      console.error(e.name, ...e.issues, ...z.treeifyError(e).errors);
    } else if (e instanceof Error) {
      console.error(e.name, e.message);
    } else {
      console.error(e);
    }
    return _init;
  }
};

const pageConfig = $state(initial());

export { pageConfig };
