import { z } from 'zod';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
} from 'lucide-react';

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

export type Task = z.infer<typeof taskSchema>;

export const labels = [
  {
    value: 'uk',
    label: 'Uk',
    icon: CircleOff,
  },
  {
    value: 'europe',
    label: 'Europe',
    icon: Timer,
  },
];

export const risk = [
  {
    label: 'Low',
    value: 'Low',
    icon: ArrowDown,
  },
  {
    label: 'Medium',
    value: 'Medium',
    icon: ArrowRight,
  },
  {
    label: 'High',
    value: 'High',
    icon: ArrowUp,
  },
];
