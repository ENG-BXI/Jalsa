import z from 'zod';
import { USER_ROLES } from '../../../enum/user.role.js';

export const ChangeRoleDtoSchema = z.object({
  memberId: z.uuid().min(1, 'Member Id is required'),
  role: z.enum(USER_ROLES)
});

export type ChangeRoleDto = z.infer<typeof ChangeRoleDtoSchema>;
