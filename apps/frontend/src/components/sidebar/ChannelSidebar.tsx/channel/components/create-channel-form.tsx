import {zodResolver} from '@hookform/resolvers/zod';

import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {FieldGroup} from '@/components/ui/field';
import InputField from '@/components/form/input-field';
import SelectField from '@/components/form/select-field';
import {useCreateChannel} from '@/api/channel/api';
import {useEffect} from 'react';
import {useAppDialog} from '@/store/dialog-store';
import type {TCreateChannelResponse} from '@/api/channel/type';

const createChannelSchema = z.object({
  name: z.string().trim().min(2, 'Channel name must be at least 2 characters.').max(50, 'Channel name must be at most 50 characters.'),
  type: z.enum(['TEXT', 'VOICE'])
});

export type CreateChannelFormValues = z.infer<typeof createChannelSchema>;

const CreateChannelForm = ({serverId, onClose}: {serverId: string; onClose: (data: TCreateChannelResponse) => void}) => {
  const {mutate: createChannelMutate, isPending} = useCreateChannel();
  const {dialog, setDialog} = useAppDialog();
  const form = useForm<CreateChannelFormValues>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: '',
      type: 'TEXT'
    }
  });

  function handleSubmit(data: CreateChannelFormValues) {
    createChannelMutate(
      {
        body: {
          ...data,
          serverId
        }
      },
      {
        onSuccess: ({data}) => {
          onClose(data.data);
        }
      }
    );
  }

  useEffect(() => {
    if (isPending && dialog) {
      setDialog({
        ...dialog,

        primaryAction: {
          ...dialog.primaryAction,
          text: isPending ? 'Creating Channel' : 'Create Channel',
          disabled: isPending
        },

        secondaryAction: {
          ...dialog.secondaryAction,
          text: dialog.secondaryAction?.text || '',
          disabled: isPending
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  return (
    <form id='create-channel-form' onSubmit={form.handleSubmit(handleSubmit)} className='space-y-5'>
      <FieldGroup>
        <InputField
          label='Channel Name'
          description='Choose a name for your channel.'
          placeholder='e.g. general'
          control={form.control}
          register={form.register('name')}
          props={{
            id: 'channel-name',
            disabled: isPending
          }}
        />

        <div className='space-y-3'>
          <SelectField
            label='Channel Type'
            description='Choose how members will communicate in this channel.'
            placeholder='Select channel type'
            control={form.control}
            register={form.register('type')}
            disabled={isPending}
            options={[
              {
                label: 'Text',
                value: 'TEXT'
              },
              {
                label: 'Voice',
                value: 'VOICE'
              }
            ]}
          />
        </div>
      </FieldGroup>
    </form>
  );
};

export default CreateChannelForm;
