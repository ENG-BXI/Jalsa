import z from 'zod';

export const EditUserDtoSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    userName: z.string().min(1, 'Username is required'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
  })
  .partial();

export type EditUserDto = z.infer<typeof EditUserDtoSchema>;

