import z from 'zod';

export const MessageDtoSchema = z.object({
  text: z.string().optional(),
});

export type MessageDto = z.infer<typeof MessageDtoSchema>;
