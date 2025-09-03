import z from 'zod';

export const entrySchema = z.object({
  id: z.number(),
  form: z.string(),
});

export type Entry = z.infer<typeof entrySchema>;

export const translationSchema = z.object({
  title: z.string(),
  forms: z.string().array(),
});

export type Translation = z.infer<typeof translationSchema>;

export const contentSchema = z.object({
  title: z.string(),
  text: z.string(),
});

export type Content = z.infer<typeof translationSchema>;

export const variationSchema = z.object({
  title: z.string(),
  form: z.string(),
});

export type Variation = z.infer<typeof variationSchema>;

export const relationSchema = z.object({
  title: z.string(),
  entry: entrySchema,
});

export type Relation = z.infer<typeof relationSchema>;

const wordObj = {
  entry: entrySchema,
  translations: translationSchema.array(),
  tags: z.string().array(),
  contents: contentSchema.array(),
  variations: variationSchema.array(),
  relations: relationSchema.array(),
};

export const wordv1Schema = z.object(wordObj);
export const wordv2Schema = z.looseObject(wordObj);

export type Wordv1 = z.infer<typeof wordv1Schema>;
export type Wordv2 = z.infer<typeof wordv2Schema>;

export const zpdicExampleSchema = z.object({
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
  }).optional(),
});

export type ZpDICExample = z.infer<typeof zpdicExampleSchema>;

export const zpdicConfigSchema = z.object({
  explanation: z.string(),
  punctuations: z.string().array(),
  ignoredPattern: z.string(),
  pronunciationTitle: z.string(),
  enableMarkdown: z.boolean(),
});

export type ZpDICConfig = z.infer<typeof zpdicConfigSchema>;

export const otmjsonv1Schema = z.object({
  version: z.literal(1).optional(),
  words: wordv1Schema.array(),
});

export const otmjsonv2Schema = z.looseObject({
  version: z.literal(2),
  words: wordv2Schema.array(),
  examples: zpdicExampleSchema.array().optional(),
  zpdicOnline: zpdicConfigSchema.optional(),
});

const otmjson_brand_ = Symbol();

export const otmjsonSchema = z
  .discriminatedUnion('version', [otmjsonv1Schema, otmjsonv2Schema])
  .brand(otmjson_brand_);

export type OTMJSONv1 = z.infer<typeof otmjsonv1Schema>;
export type OTMJSONv2 = z.infer<typeof otmjsonv2Schema>;
export type OTMJSON = z.infer<typeof otmjsonSchema>;
export type ZpDICOTMJSON = Required<OTMJSONv2>;

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
