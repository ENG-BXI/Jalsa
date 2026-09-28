import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {IconLoader2, IconPlus, IconSend2} from '@tabler/icons-react';
import {cn} from 'cn';
import {useState, type Dispatch, type SubmitEvent} from 'react';
interface ChannelTextInputProps {
  onSubmit: (e: SubmitEvent<HTMLFormElement>, message: string, setMessage: Dispatch<React.SetStateAction<string>>) => void;
  isLoading: boolean;
  placeholder?: string;
}
const ChannelTextInput = ({onSubmit, isLoading, placeholder}: ChannelTextInputProps) => {
  const [message, setMessage] = useState<string>('');
  return (
    <form id='send-message' onSubmit={e => onSubmit(e, message, setMessage)} className='h-14 absolute bottom-0 left-0 right-0 mx-2 my-2 bg-[#222327] rounded-md flex items-center px-4 focus-visible:border border-border-1'>
      <IconPlus className='text-text-1' />
      <Input value={message} onChange={e => setMessage(e.target.value)} className='border-none! bg-transparent! focus-visible:ring-0 placeholder:text-text-1' placeholder={placeholder} />
      <Button type='submit' disabled={isLoading || !message.trim()} className={cn('opacity-50', message.trim() && 'opacity-100')}>
        {isLoading ? <IconLoader2 className='animate-spin' /> : <IconSend2 />}
      </Button>
    </form>
  );
};

export default ChannelTextInput;
