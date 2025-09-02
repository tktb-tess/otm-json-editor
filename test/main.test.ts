import { it, expect, describe } from 'vitest';

it('check env', () => {
    expect(typeof import.meta.env.VITE_APP_NAME).toBe('string');
});