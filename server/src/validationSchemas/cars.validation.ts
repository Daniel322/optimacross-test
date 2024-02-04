import { z } from 'zod';

export const getListQuerySchema = z.object({
  brand: z.string({ required_error: 'need to set brand' }),
  sort: z.optional(z.string().refine((val) => ['name', 'price', 'yearOfCreated'].includes(val), { message: 'set corrected sort column: name or price or yearOfCreated' })),
  sortType: z.optional(z.string().refine((val) => ['asc', 'desc'].includes(val), { message: 'invalid sort type, use only asc or desc' })),
  limit: z.string({ required_error: 'need to set limit' }).refine((val) => !Number.isNaN(Number(val))),
  offset: z.string({ required_error: 'need to set offset' }).refine((val) => !Number.isNaN(Number(val))),
})