import {Link, useNavigate} from 'react-router';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

import {Button} from '@/components/ui/button';
import InputField from '@/components/form/input-field';
import {useIsUserNameAvailable, useRegister} from '@/api/auth/api';
import {useUser} from '@/store/user-info-store';
import {useDebounce} from '@/hooks/use-debounce';
import {useEffect} from 'react';

const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  userName: z.string().min(1, 'Username is required'),
  email: z.email().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters')
});

type RegisterFormValues = z.infer<typeof RegisterSchema>;

const Register = () => {
  const {mutate: register, isPending} = useRegister();
  const {mutate: checkIsUserNameAvailable, isPending: IsUserNameAvailablePending, data} = useIsUserNameAvailable();
  const setUser = useUser(state => state.setUser);
  const navigate = useNavigate();
  const {control, handleSubmit, watch, setError} = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      userName: '',
      email: '',
      password: ''
    }
  });
  const userName = watch('userName');
  const debouncedUsername = useDebounce(userName);
  useEffect(() => {
    if (debouncedUsername)
      checkIsUserNameAvailable(
        {userName: debouncedUsername},
        {
          onSuccess: data => {
            const isAvailable = data.data.data;
            if (!isAvailable) setError('userName', {message: 'Username is already taken'});
            else setError('userName', {message: ''});
          }
        }
      );
  }, [debouncedUsername]);

  const isAvailable = data?.data.data;

  const onSubmit = (data: RegisterFormValues) => {
    register(data, {
      onSuccess: ({data}) => {
        setUser(data.data.user);
        navigate('/');
      }
    });
  };
  return (
    <div className='w-full max-w-120 rounded-[5px] bg-[#313338] p-8 shadow-2xl'>
      <div className='mb-6 text-center'>
        <h1 className='text-[24px] font-semibold text-[#f2f3f5]'>Create an account</h1>

        <p className='mt-2 text-[15px] text-[#b5bac1]'>We're excited to have you join us!</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <InputField
          control={control}
          register={{name: 'name'}}
          required
          label='NAME'
          labelClassName='text-[12px] font-bold uppercase tracking-wide text-[#b5bac1]'
          inputClassName='h-[40px] w-full rounded-[3px] border-none bg-[#1e1f22] px-3 text-[16px] text-[#dbdee1] shadow-none focus-visible:ring-0 focus:outline-none'
          props={{
            id: 'name',
            disabled: isPending
          }}
        />

        <InputField
          control={control}
          register={{name: 'userName'}}
          required
          isLoading={IsUserNameAvailablePending}
          label='USERNAME'
          labelClassName='text-[12px] font-bold uppercase tracking-wide text-[#b5bac1]'
          inputClassName='h-[40px] w-full rounded-[3px] border-none bg-[#1e1f22] px-3 text-[16px] text-[#dbdee1] shadow-none focus-visible:ring-0 focus:outline-none'
          props={{
            id: 'userName',
            disabled: isPending
          }}
        />

        <InputField
          control={control}
          register={{name: 'email'}}
          required
          label='EMAIL'
          labelClassName='text-[12px] font-bold uppercase tracking-wide text-[#b5bac1]'
          inputClassName='h-[40px] w-full rounded-[3px] border-none bg-[#1e1f22] px-3 text-[16px] text-[#dbdee1] shadow-none focus-visible:ring-0 focus:outline-none'
          props={{
            id: 'email',
            type: 'email',
            disabled: isPending
          }}
        />

        <InputField
          control={control}
          register={{name: 'password'}}
          required
          label='PASSWORD'
          labelClassName='text-[12px] font-bold uppercase tracking-wide text-[#b5bac1]'
          inputClassName='h-[40px] w-full rounded-[3px] border-none bg-[#1e1f22] px-3 text-[16px] text-[#dbdee1] shadow-none focus-visible:ring-0 focus:outline-none'
          props={{
            id: 'password',
            type: 'password',
            disabled: isPending
          }}
        />

        <div className='pt-2'>
          <Button disabled={isPending || IsUserNameAvailablePending || !isAvailable} type='submit' className='h-11 w-full rounded-[3px] bg-brand text-[16px] font-medium text-white transition-colors hover:bg-brand-hover'>
            Register
          </Button>
        </div>
      </form>

      <p className='mt-4 text-[14px] text-[#b5bac1]'>
        Already have an account?{' '}
        <Link to='/login' className='font-medium text-[#00a8fc] hover:underline'>
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Register;
