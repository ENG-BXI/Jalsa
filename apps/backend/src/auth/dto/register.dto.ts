import z from 'zod';

export const RegisterDtoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  userName: z
    .string()
    .min(3, {
      error: 'Username must be at least 3 characters'
    })
    .max(20, {
      error: 'Username must be at most 20 characters'
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: 'Username can only contain letters, numbers and underscores'
    }),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});
export type RegisterDto = z.infer<typeof RegisterDtoSchema>;
