import z from 'zod';

export const CreateServerDtoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isPublic: z.coerce.boolean<boolean>().default(false)
});

export type CreateServerDto = z.infer<typeof CreateServerDtoSchema>;
