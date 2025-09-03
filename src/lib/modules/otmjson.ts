import z from 'zod';

const entrySchema = z.object({
  id: z.number(),
  form: z.string(),
});

const translationSchema = z.object({
  title: z.string(),
  forms: z.string().array(),
});

const contentSchema = z.object({
  title: z.string(),
  text: z.string(),
});

const variationSchema = z.object({
  title: z.string(),
  form: z.string(),
});

const relationSchema = z.object({
  title: z.string(),
  entry: entrySchema,
});

const wordObj = {
  entry: entrySchema,
  translations: translationSchema.array(),
  tags: z.string().array(),
  contents: contentSchema.array(),
  variations: variationSchema.array(),
  relations: relationSchema.array(),
};

const wordSchema = z.object(wordObj);
const wordv2Schema = z.looseObject(wordObj);

const exampleSchema = z.object({
  id: z.number(),
  sentence: z.string(),
  translation: z.string(),
  supplement: z.string(),
  tags: z.string().array(),
  words: z
    .object({
      id: z.number(),
    })
    .array(),
  offer: z.object({
    catalog: z.string(),
    number: z.number(),
  }),
});

const zpdicConfigSchema = z.object({
  explanation: z.string(),
  punctuations: z.string().array(),
  ignoredPattern: z.string(),
  pronunciationTitle: z.string(),
  enableMarkdown: z.boolean(),
});

const otmjsonv1Schema = z.object({
  version: z.literal(1).optional(),
  words: wordSchema.array(),
});

const otmjsonv2Schema = z.looseObject({
  version: z.literal(2),
  words: wordv2Schema.array(),
  examples: exampleSchema.array().optional(),
  zpdicOnline: zpdicConfigSchema.optional(),
});

const otmjson_brand_ = Symbol();

export const otmjsonSchema = z
  .discriminatedUnion('version', [otmjsonv1Schema, otmjsonv2Schema])
  .brand(otmjson_brand_);

export type OTMJSON = z.infer<typeof otmjsonSchema>;

export const parseOtmjson = (json: string): OTMJSON | Error => {
  try {
    return otmjsonSchema.parse(JSON.parse(json));
  } catch (e) {
    if (e instanceof Error) {
      return e;
    } else {
      return Error(`unidentified error: ${e}`);
    }
  }
};
