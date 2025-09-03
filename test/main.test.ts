import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { otmjsonSchema } from '../src/lib/modules/otmjson';
import z from 'zod';
import { resolve } from 'node:path';

it('check scheme', () => {
  try {
    const json = readFileSync(resolve(__dirname, './vl-ja.json'), {
      encoding: 'utf8',
    });

    const parsed = otmjsonSchema.parse(JSON.parse(json));
    const { words } = parsed;
    words.sort(({ entry: a }, { entry: b }) => 
      a.id - b.id
    );
    
    words.forEach(({ entry, translations }) =>
      console.log(entry.form, ...translations.map(({ title, forms }) => title.concat(': ', forms.join(', '))))
    );

    expect(0).toBe(0);

  } catch (e) {
    if (e instanceof z.ZodError) {
      console.error(e.name, ...e.issues, z.prettifyError(e));
    } else {
      console.error('unidentified!', e);
    }
    expect.unreachable('!');
  }
});
