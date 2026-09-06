import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel} from '@/components/ui/field';

const createServerSchema = z.object({
  name: z.string().trim().min(2, 'Server name must be at least 2 characters.').max(50, 'Server name must be at most 50 characters.'),

  description: z.string().trim().max(200, 'Description must be at most 200 characters.').optional()
});

export type CreateServerFormValues = z.infer<typeof createServerSchema>;

interface CreateServerFormProps {
  onSubmit: (data: CreateServerFormValues) => void;
}

const CreateServerForm = ({onSubmit}: CreateServerFormProps) => {
  const form = useForm<CreateServerFormValues>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  return (
    <form id={'create-server-form'} onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor='server-name'>Server Name</FieldLabel>

          <Input {...form.register('name')} id='server-name' placeholder='e.g. Jalsa Developers' aria-invalid={!!form.formState.errors.name} autoComplete='off' />

          <FieldDescription>Choose a name that represents your community.</FieldDescription>

          {form.formState.errors.name && <FieldError errors={[form.formState.errors.name]} />}
        </Field>

        <Field data-invalid={!!form.formState.errors.description}>
          <FieldLabel htmlFor='server-description'>Description</FieldLabel>

          <Textarea {...form.register('description')} id='server-description' placeholder='Tell people what your server is about...' className='min-h-24 resize-none' aria-invalid={!!form.formState.errors.description} />

          <FieldDescription>A short description to help people understand your server.</FieldDescription>

          {form.formState.errors.description && <FieldError errors={[form.formState.errors.description]} />}
        </Field>
      </FieldGroup>
    </form>
  );
};

export default CreateServerForm;
