import { writableWithStorage } from './writable-with-storage';
import { pgConfSchema, storageKeys } from './decl';

const pageConfig = writableWithStorage(
  storageKeys.pageConfig,
  'local',
  pgConfSchema,
  {
    colorScheme: 'light',
  }
);

export { pageConfig };
