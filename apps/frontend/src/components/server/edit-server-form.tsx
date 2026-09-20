import {zodResolver} from '@hookform/resolvers/zod';

import {Controller, useForm} from 'react-hook-form';

import {z} from 'zod';

import {FieldGroup} from '@/components/ui/field';
import {Switch} from '@/components/ui/switch';

import InputField from '../form/input-field';
import TextareaField from '../form/textarea-field';
import FileUploadField from '../form/upload-file';

import {useEditServer, useServerById} from '@/api/server/api';

import {useEffect} from 'react';

const editServerSchema = z.object({
  name: z.string().trim().min(2, 'Server name must be at least 2 characters.').max(50, 'Server name must be at most 50 characters.'),

  description: z.string().trim().max(200, 'Description must be at most 200 characters.').optional(),

  image: z
    .instanceof(File, {
      message: 'Please select a server image.'
    })
    .optional(),

  isPublic: z.boolean()
});

export type EditServerFormValues = z.infer<typeof editServerSchema>;

const EditServerForm = ({serverId, onClose}: {serverId: string; onClose: (data: EditServerFormValues) => void}) => {
  const {data, isLoading, isFetched, isError} = useServerById(serverId, {select: res => res.data.data});

  const {mutate: editServer, isPending} = useEditServer();

  const form = useForm<EditServerFormValues>({
    resolver: zodResolver(editServerSchema),

    defaultValues: {
      name: '',
      description: '',
      image: undefined,
      isPublic: false
    }
  });

  useEffect(() => {
    if (isFetched && !isError && data) {
      form.setValue('name', data.name);
      form.setValue('description', data.description ?? '');
      form.setValue('isPublic', data.isPublic);
      form.setValue('image', undefined);
    }
  }, [data, form, isError, isFetched]);

  function handleSubmit(data: EditServerFormValues) {
    editServer(
      {
        id: serverId,
        body: data
      },
      {
        onSuccess: () => {
          onClose(data);
        }
      }
    );
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
            id: 'server-image',
            disabled: isLoading || isPending
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
            id: 'server-name',
            disabled: isLoading || isPending
          }}
        />

        <TextareaField
          label='Description'
          description='A short description to help people understand your server.'
          placeholder='Tell people what your server is about...'
          control={form.control}
          register={form.register('description')}
          props={{
            id: 'server-description',
            disabled: isLoading || isPending
          }}
        />

        <Controller
          control={form.control}
          name='isPublic'
          render={({field}) => (
            <div className='flex items-center justify-between rounded-lg border border-border-1 bg-primary-3/30 p-4'>
              <div>
                <p className='text-sm font-medium text-white'>Public Server</p>

                <p className='mt-1 text-xs leading-5 text-text-1'>Allow other users to discover and join this server.</p>
              </div>

              <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading || isPending} />
            </div>
          )}
        />
      </FieldGroup>
    </form>
  );
};

export default EditServerForm;
