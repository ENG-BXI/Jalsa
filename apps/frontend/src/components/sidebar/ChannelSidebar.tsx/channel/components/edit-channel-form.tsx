import {zodResolver} from '@hookform/resolvers/zod';

import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {useEditChannel, useGetChannelById} from '@/api/channel/api';
import {FieldGroup} from '@/components/ui/field';
import InputField from '@/components/form/input-field';
import {useAppDialog} from '@/store/dialog-store';

const editChannelSchema = z.object({
  name: z.string().trim().min(2, 'Channel name must be at least 2 characters.').max(50, 'Channel name must be at most 50 characters.')
});

export type EditChannelFormValues = z.infer<typeof editChannelSchema>;

const EditChannelForm = ({channelId, serverId, onClose}: {channelId: string; serverId: string; onClose: (data: EditChannelFormValues) => void}) => {
  const {data, isLoading, isFetched, isError} = useGetChannelById(channelId, {
    select: res => res.data.data
  });
  const {dialog, setDialog} = useAppDialog();
  const {mutate: editChannel, isPending} = useEditChannel();

  const form = useForm<EditChannelFormValues>({
    resolver: zodResolver(editChannelSchema),
    defaultValues: {
      name: ''
    }
  });

  useEffect(() => {
    if (isFetched && !isError && data) {
      form.setValue('name', data.name);
    }
  }, [data, form, isError, isFetched]);

  useEffect(() => {
    if (isPending && dialog) {
      setDialog({
        ...dialog,
        primaryAction: {
          ...dialog.primaryAction,
          text: isPending ? 'Saving Changes' : 'Save Changes',
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

  function handleSubmit(data: EditChannelFormValues) {
    editChannel(
      {
        channelId,
        serverId,
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
    <form id='edit-channel-form' onSubmit={form.handleSubmit(handleSubmit)} className='space-y-5'>
      <FieldGroup>
        <InputField
          label='Channel Name'
          description='Choose a name for your channel.'
          placeholder='e.g. general'
          control={form.control}
          register={form.register('name')}
          props={{
            id: 'channel-name',
            disabled: isLoading || isPending
          }}
        />
      </FieldGroup>
    </form>
  );
};

export default EditChannelForm;
