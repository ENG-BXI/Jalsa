import z from 'zod';

export const EditServerDtoSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    isPublic: z.boolean().default(false)
  })
  .partial();

export type EditServerDto = z.infer<typeof EditServerDtoSchema>;
