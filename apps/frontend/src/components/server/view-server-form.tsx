import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {Field, FieldGroup, FieldLabel} from '@/components/ui/field';

import InputField from '../form/input-field';
import TextareaField from '../form/textarea-field';
import {useServerById} from '@/api/server/api';
import {useEffect} from 'react';
import {formatText} from '@/lib/utils';
import {Skeleton} from '../ui/skeleton';

const viewServerSchema = z.object({
  name: z.string(),
  description: z.string().optional()
});

export type ViewServerFormValues = z.infer<typeof viewServerSchema>;

const ViewServerForm = ({serverId}: {serverId: string}) => {
  const {data, isLoading, isFetched, isError} = useServerById(serverId, {select: res => res.data.data});
  const form = useForm<ViewServerFormValues>({
    resolver: zodResolver(viewServerSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });
  // TODO : View All Member Here in this Form for add Action (Leave , make an Admin)
  useEffect(() => {
    if (isFetched && !isError) {
      form.setValues({
        name: data?.name,
        description: data?.description
      });
    }
  }, [data, form, isError, isFetched, isLoading]);
  return (
    <form className='space-y-5'>
      <FieldGroup>
        <Field>
          <FieldLabel>Server Image</FieldLabel>
          {isLoading ? (
            <div className='flex justify-center'>
              <Skeleton className='size-32 rounded-lg' />
            </div>
          ) : (
            <div className='flex justify-center'>{data?.avatar_url ? <img src={data.avatar_url} alt={data.name} className='size-32 rounded-lg object-cover' /> : <div className='flex size-32 items-center justify-center rounded-lg bg-indigo-400 text-3xl font-semibold uppercase'>{formatText(data?.name || '', {mode: 'first-letter-of-words'})}</div>}</div>
          )}
        </Field>

        <InputField
          label='Server Name'
          control={form.control}
          register={form.register('name')}
          props={{
            id: 'server-name',
            readOnly: true,
            disabled: isLoading
          }}
        />

        <TextareaField
          label='Description'
          control={form.control}
          register={form.register('description')}
          props={{
            id: 'server-description',
            readOnly: true,
            disabled: isLoading
          }}
        />
      </FieldGroup>
    </form>
  );
};

export default ViewServerForm;
