import { storageKeys } from './decl';
import { otmjsonv2Schema } from './otmjson';
import { writableWithStorage } from './writable-with-storage';

const otmjsonData = writableWithStorage(
  storageKeys.otmjsonData,
  'session',
  otmjsonv2Schema
);

export { otmjsonData };
