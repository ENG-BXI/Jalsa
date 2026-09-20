import z from 'zod';

export const KickUserFromServerDtoSchema = z.object({
  memberId: z.uuid().min(1, 'Member Id is required')
});

export type KickUserFromServerDto = z.infer<typeof KickUserFromServerDtoSchema>;
