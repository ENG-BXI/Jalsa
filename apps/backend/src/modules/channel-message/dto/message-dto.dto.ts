import z from 'zod';

export const MessageDtoSchema = z.object({
  text: z.string().min(1, 'text is required'),
  imageUrl: z.string().optional(),
});

export type MessageDto = z.infer<typeof MessageDtoSchema>;
