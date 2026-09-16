import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {FieldGroup} from '@/components/ui/field';
import InputField from '../form/input-field';
import TextareaField from '../form/textarea-field';
import FileUploadField from '../form/upload-file';
import {useCreateServer} from '@/api/server/api';
import {useAppDialog} from '@/store/dialog-store';
import {useEffect} from 'react';

const createServerSchema = z.object({
  name: z.string().trim().min(2, 'Server name must be at least 2 characters.').max(50, 'Server name must be at most 50 characters.'),

  description: z.string().trim().max(200, 'Description must be at most 200 characters.').optional(),

  image: z
    .instanceof(File, {
      message: 'Please select a server image.'
    })
    .optional()
});

export type CreateServerFormValues = z.infer<typeof createServerSchema>;

interface CreateServerFormProps {
  onClose: () => void;
}

const CreateServerForm = ({onClose}: CreateServerFormProps) => {
  const {mutate: createServer, isPending} = useCreateServer();
  const {dialog, setDialog} = useAppDialog();
  const form = useForm<CreateServerFormValues>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      name: '',
      description: '',
      image: undefined
    }
  });
  function onSubmit(data: CreateServerFormValues) {
    createServer(
      {
        name: data.name,
        description: data.description,
        isPublic: true
      },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  }
  useEffect(() => {
    if (dialog)
      setDialog({
        ...dialog,
        primaryAction: isPending
          ? {
              ...dialog.primaryAction,
              text: 'Creating Server',
              disabled: true
            }
          : {...dialog.primaryAction, text: 'Create Server', disabled: false},
        secondaryAction:
          dialog.secondaryAction &&
          (isPending
            ? {
                ...dialog.secondaryAction,
                text: dialog.secondaryAction!.text,
                disabled: true
              }
            : {...dialog.secondaryAction, text: dialog.secondaryAction?.text || '', disabled: false})
      });
  }, [isPending]);

  return (
    <form id='create-server-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
      <FieldGroup>
        <FileUploadField
          label='Server Image'
          description='Upload an image to represent your server.'
          accept='image/png,image/jpeg,image/webp'
          control={form.control}
          register={form.register('image')}
          props={{
            id: 'server-image',
            disabled: isPending
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
            disabled: isPending
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
            disabled: isPending
          }}
        />
      </FieldGroup>
    </form>
  );
};

export default CreateServerForm;
