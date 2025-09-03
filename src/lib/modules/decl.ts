import { z } from 'zod';

export const pgConfSchema = z.object({
  colorScheme: z.literal(['light', 'dark']),
});

export type PageConfig = z.infer<typeof pgConfSchema>;

export type ColorScheme = z.infer<typeof pgConfSchema.shape.colorScheme>;

export const storageKeys = {
  pageConfig: 'page-config',
} as const;

export type StorageKeys = typeof storageKeys;
