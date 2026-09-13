import z from 'zod';
import {CHANNEL_TYPE} from '../../../enum/user.role copy.js';

export const EditChannelDtoSchema = z
  .object({
    name: z.string().min(1, 'Name is required')
  })
  .partial();

export type EditChannelDto = z.infer<typeof EditChannelDtoSchema>;
