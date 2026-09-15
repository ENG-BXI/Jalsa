import {Link, useNavigate} from 'react-router';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

import {Button} from '@/components/ui/button';
import InputField from '@/components/form/input-field';
import {useLogin} from '@/api/auth/api';
import {useUser} from '@/store/user-info-store';

const loginSchema = z.object({
  email: z.email().min(1, 'Email is required'),

  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters')
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const {mutate: login, isPending} = useLogin();
  const setUser = useUser(state => state.setUser);
  const navigate = useNavigate();
  const {control, handleSubmit} = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onSuccess: ({data}) => {
        setUser(data.data.user);
        navigate('/');
      }
    });
  };

  return (
    <div className='w-full max-w-120 rounded-[5px] bg-[#313338] p-8 shadow-2xl'>
      <div className='mb-6 text-center'>
        <h1 className='text-[24px] font-semibold text-[#f2f3f5]'>Welcome back!</h1>

        <p className='mt-2 text-[15px] text-[#b5bac1]'>We're so excited to see you again!</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='space-y-2'>
          <InputField
            control={control}
            register={{
              name: 'email'
            }}
            required
            label='EMAIL'
            labelClassName='text-[12px] font-bold uppercase tracking-wide text-[#b5bac1]'
            inputClassName='h-[40px] w-full rounded-[3px] border-none bg-[#1e1f22] px-3 text-[16px] text-[#dbdee1] shadow-none focus-visible:ring-0 focus:outline-none'
            props={{
              id: 'email',
              disabled: isPending
            }}
          />
        </div>

        <div className='space-y-2'>
          <InputField
            control={control}
            register={{
              name: 'password'
            }}
            label='PASSWORD'
            required
            labelClassName='text-[12px] font-bold uppercase tracking-wide text-[#b5bac1]'
            inputClassName='h-[40px] w-full rounded-[3px] border-none bg-[#1e1f22] px-3 text-[16px] text-[#dbdee1] shadow-none focus-visible:ring-0 focus:outline-none'
            props={{
              id: 'password',
              type: 'password',
              disabled: isPending
            }}
          />
        </div>

        <div className='pt-2'>
          <Button disabled={isPending} type='submit' className='h-11 w-full rounded-[3px] bg-brand text-[16px] font-medium text-white transition-colors hover:bg-brand-hover'>
            Log In
          </Button>
        </div>
      </form>

      <p className='mt-4 text-[14px] text-[#b5bac1]'>
        Need an account?{' '}
        <Link to='/register' className='font-medium text-[#00a8fc] hover:underline'>
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
