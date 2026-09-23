import {useSendMessage} from '@/api/channel-message/api';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useChannel} from '@/store/use-channel';
import {IconLoader2, IconPlus, IconSend2} from '@tabler/icons-react';
import {cn} from 'cn';
import {useState, type SubmitEvent} from 'react';
interface ChannelTextInputProps {
  placeholder?: string;
}
const ChannelTextInput = ({placeholder}: ChannelTextInputProps) => {
  const {mutate: sendMessage, isPending} = useSendMessage();
  const [message, setMessage] = useState<string>('');
  const {channel} = useChannel();
  function handleOnSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!channel.id) return;
    if (!message) return;
    sendMessage(
      {
        channelId: channel.id,
        message: {
          text: message
        }
      },
      {
        onSuccess: () => {
          setMessage('');
        }
      }
    );
  }
  return (
    <form id='send-message' onSubmit={handleOnSubmit} className='h-14 absolute bottom-0 left-0 right-0 mx-2 my-2 bg-[#222327] rounded-md flex items-center px-4 focus-visible:border border-border-1'>
      <IconPlus className='text-text-1' />
      <Input value={message} onChange={e => setMessage(e.target.value)} className='border-none! bg-transparent! focus-visible:ring-0 placeholder:text-text-1' placeholder={placeholder} />
      <Button type='submit' disabled={isPending || !message.trim()} className={cn('opacity-50', message.trim() && 'opacity-100')}>
        {isPending ? <IconLoader2 className='animate-spin' /> : <IconSend2 />}
      </Button>
    </form>
  );
};

export default ChannelTextInput;
