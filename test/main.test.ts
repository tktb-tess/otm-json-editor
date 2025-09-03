import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { otmjsonSchema } from '../src/lib/modules/otmjson';
import z from 'zod'; 
it('check scheme', async () => {
  try {
    const json = readFileSync('./.arc/vl-ja.json', { encoding: 'utf8' });
    const parsed = otmjsonSchema.parse(JSON.parse(json));
    parsed.words.forEach((w) => console.log(w.entry.form, w.translations[0].forms[0], w.contents.find(({ title }) => title === '説明')?.text.replaceAll('\n', ' ').trim()));
    expect(0).toBe(0);
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.error(e.name, e.message, ...e.issues, ...z.treeifyError(e).errors);
    } else {
      console.error('unidentified!');
    }
    expect.unreachable('!');
  }
});
