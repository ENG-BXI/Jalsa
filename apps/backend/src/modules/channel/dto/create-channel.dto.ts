import z from 'zod';
import {CHANNEL_TYPE} from '../../../enum/user.role copy.js';

export const CreateChannelDtoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(CHANNEL_TYPE),
  serverId: z.uuid().min(1, 'serverId is required')
});

export type CreateChannelDto = z.infer<typeof CreateChannelDtoSchema>;
