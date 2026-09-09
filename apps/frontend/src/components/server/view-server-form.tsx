import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {Field, FieldGroup, FieldLabel} from '@/components/ui/field';

import InputField from '../form/input-field';
import TextareaField from '../form/textarea-field';

const viewServerSchema = z.object({
  name: z.string(),
  description: z.string().optional()
});

export type ViewServerFormValues = z.infer<typeof viewServerSchema>;

const ViewServerForm = ({serverId}: {serverId: string}) => {
  console.log('====================================');
  console.log(serverId);
  console.log('====================================');
  const form = useForm<ViewServerFormValues>({
    resolver: zodResolver(viewServerSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  return (
    <form className='space-y-5'>
      <FieldGroup>
        <Field>
          <FieldLabel>Server Image</FieldLabel>

          <div className='flex justify-center'>
            <img src={'https://api.dicebear.com/9.x/shapes/svg?seed=jalsa'} alt={'https://api.dicebear.com/9.x/shapes/svg?seed=jalsa'} className='size-32 rounded-lg object-cover' />
          </div>
        </Field>

        <InputField
          label='Server Name'
          control={form.control}
          register={form.register('name')}
          props={{
            id: 'server-name',
            readOnly: true
          }}
        />

        <TextareaField
          label='Description'
          control={form.control}
          register={form.register('description')}
          props={{
            id: 'server-description',
            readOnly: true
          }}
        />
      </FieldGroup>
    </form>
  );
};

export default ViewServerForm;
