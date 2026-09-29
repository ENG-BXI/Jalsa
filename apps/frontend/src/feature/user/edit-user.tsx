import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {FieldGroup} from '@/components/ui/field';
import InputField from '@/components/form/input-field';

import {useEditUser} from '@/api/user/api';
import {useIsUserNameAvailable, useMe} from '@/api/auth/api';
import {useEffect} from 'react';
import {useDebounce} from '@/hooks/use-debounce';

const editUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(50, 'Name must be at most 50 characters.'),

  userName: z.string().trim().min(3, 'Username must be at least 3 characters.').max(30, 'Username must be at most 30 characters.')
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

const EditUserForm = ({onClose}: {onClose: () => void}) => {
  const {data} = useMe({
    select: res => res.data.data
  });
  const {mutate: checkIsUserNameAvailable, isPending: IsUserNameAvailablePending, data: userNameData} = useIsUserNameAvailable();
  const {mutate: editUser, isPending} = useEditUser();

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),

    defaultValues: {
      name: '',
      userName: ''
    }
  });
  const userName = form.watch('userName');
  const debouncedUsername = useDebounce(userName);
  useEffect(() => {
    if (debouncedUsername && userName !== data?.userName)
      checkIsUserNameAvailable(
        {userName: debouncedUsername},
        {
          onSuccess: data => {
            const isAvailable = data.data.data;
            if (!isAvailable) form.setError('userName', {message: 'Username is already taken'});
            else form.setError('userName', {message: ''});
          }
        }
      );
  }, [debouncedUsername]);
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        userName: data.userName
      });
    }
  }, [data, form]);

  function handleSubmit(data: EditUserFormValues) {
    if (!IsUserNameAvailablePending || isAvailable)
      editUser(data, {
        onSuccess: () => {
          onClose();
        }
      });
  }
  const isAvailable = userNameData?.data.data;

  return (
    <form id='edit-user-form' onSubmit={form.handleSubmit(handleSubmit)} className='space-y-5'>
      <FieldGroup>
        <InputField
          label='Name'
          description='Update the name displayed on your profile.'
          placeholder='e.g. Abdulrhman Muneer'
          control={form.control}
          register={form.register('name')}
          props={{
            id: 'user-name',
            disabled: isPending
          }}
        />

        <InputField
          label='Username'
          description='Your unique username used by other users to find you.'
          placeholder='e.g. abdulrhman'
          control={form.control}
          register={form.register('userName')}
          isLoading={IsUserNameAvailablePending}
          props={{
            id: 'user-username',
            disabled: isPending
          }}
        />
      </FieldGroup>
    </form>
  );
};

export default EditUserForm;
