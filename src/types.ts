import { z } from "zod";

//
// schemas
//

export const entryOptionSchema = z.object({
  _id: z.string(),
  name: z.string(),
  cost: z.number(),
  rake: z.number(),
  chips: z.number()
});

export const breakSchema = z.object({
  _type: z.literal("break"),
  duration: z.number()
});

export const levelSchema = z.object({
  _type: z.literal("level"),
  sb: z.number(),
  bb: z.number(),
  ante: z.number(),
  duration: z.number()
});

export const roundSchema = z.discriminatedUnion("_type", [
  breakSchema,
  levelSchema
]);

export const payoutStructureSchema = z.array(z.object({ value: z.number() }));

export const gameConfigSchema = z.object({
  title: z.string(),
  payoutStructure: z.array(z.number()),
  entryOptions: z.array(entryOptionSchema),
  rounds: z.array(roundSchema)
});

//
// types
//

export type EntryOption = z.infer<typeof entryOptionSchema>;
export type Break = z.infer<typeof breakSchema>;
export type Level = z.infer<typeof levelSchema>;
export type Round = z.infer<typeof roundSchema>;
export type PayoutStructure = z.infer<typeof payoutStructureSchema>;
export type GameConfig = z.infer<typeof gameConfigSchema>;
