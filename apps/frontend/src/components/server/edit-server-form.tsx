import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {FieldGroup} from '@/components/ui/field';
import InputField from '../form/input-field';
import TextareaField from '../form/textarea-field';
import FileUploadField from '../form/upload-file';

const editServerSchema = z.object({
  name: z.string().trim().min(2, 'Server name must be at least 2 characters.').max(50, 'Server name must be at most 50 characters.'),

  description: z.string().trim().max(200, 'Description must be at most 200 characters.').optional(),

  image: z
    .instanceof(File, {
      message: 'Please select a server image.'
    })
    .optional()
});

export type EditServerFormValues = z.infer<typeof editServerSchema>;

const EditServerForm = ({serverId}: {serverId: string}) => {
  const form = useForm<EditServerFormValues>({
    resolver: zodResolver(editServerSchema),
    defaultValues: {
      name: '',
      description: '',
      image: undefined
    }
  });

  function handleSubmit(data: EditServerFormValues) {
    console.log('Update server:', {
      serverId,
      ...data
    });

    // update server API هنا
  }

  return (
    <form id='edit-server-form' onSubmit={form.handleSubmit(handleSubmit)} className='space-y-5'>
      <FieldGroup>
        <FileUploadField
          label='Server Image'
          description='Upload a new image to represent your server.'
          accept='image/png,image/jpeg,image/webp'
          control={form.control}
          register={form.register('image')}
          props={{
            id: 'server-image'
          }}
          inputClassName='min-h-32'
        />

        <InputField
          label='Server Name'
          description='Choose a name that represents your community.'
          placeholder='e.g. Jalsa Developers'
          control={form.control}
          register={form.register('name')}
          props={{
            id: 'server-name'
          }}
        />

        <TextareaField
          label='Description'
          description='A short description to help people understand your server.'
          placeholder='Tell people what your server is about...'
          control={form.control}
          register={form.register('description')}
          props={{
            id: 'server-description'
          }}
        />
      </FieldGroup>
    </form>
  );
};

export default EditServerForm;
