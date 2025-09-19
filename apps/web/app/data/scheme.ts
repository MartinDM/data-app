import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const personSchema = z.object({
  id: z.string(),
  name: z.string(),
  risk: z.number().int().min(0).max(100),
  accountNumber: z.string(),
  salary: z.number(),
  dob: z.string(), // ISO date string
  location: z.object({
    city: z.string(),
    coords: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
});

export type Person = z.infer<typeof personSchema>;
