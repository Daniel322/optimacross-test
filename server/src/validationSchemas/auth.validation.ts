import { z } from 'zod';

import { EMAIL_REGEX } from '../constants';

export const loginSchema = z.object({
  email: z.string().regex(EMAIL_REGEX),
  password: z.string(),
});