import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useAppDialog} from '@/store/dialog-store';
import {IconLoader2, IconPlus, IconSend2, IconX} from '@tabler/icons-react';
import {cn} from 'cn';
import {useRef, useState, type Dispatch, type SubmitEvent} from 'react';
import UploadImageForm from './upload-image-form';
interface ChannelTextInputProps {
  onSubmit: (e: SubmitEvent<HTMLFormElement>, message: string, setMessage: Dispatch<React.SetStateAction<string>>, file: File | null, setFile: Dispatch<React.SetStateAction<File | null>>) => void;
  onTyping?: (isTyping: boolean) => void;
  isLoading: boolean;
  placeholder?: string;
}
const ChannelTextInput = ({onSubmit, onTyping, isLoading, placeholder}: ChannelTextInputProps) => {
  const [message, setMessage] = useState<string>('');
  const {setDialog, onClose} = useAppDialog();
  const [file, setFile] = useState<File | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleUploadImage() {
    setDialog({
      title: 'Upload Image',
      content: <UploadImageForm setFile={setFile} onClose={onClose} />,
      primaryAction: {
        text: 'Upload',
        formId: 'upload-image-form'
      },
      secondaryAction: {
        text: 'Cancel'
      }
    });
  }
  const handleTyping = () => {
    onTyping?.(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onTyping?.(false);
      typingTimeoutRef.current = null;
    }, 1000);
  };
  return (
    <form id='send-message' onSubmit={e => onSubmit(e, message, setMessage, file, setFile)} className='min-h-14 absolute bottom-0 flex flex-col justify-center left-0 right-0 mx-2 my-2 bg-[#222327] rounded-md px-4 focus-visible:border border-border-1'>
      {file && (
        <div className='relative my-2 w-fit max-w-64 overflow-hidden rounded-md border border-border-1 bg-[#1a1b1f]'>
          <img src={URL.createObjectURL(file)} alt={file.name} className='h-32 w-32 object-cover' />
          <Button type='button' variant='ghost' size='icon' onClick={() => setFile(null)} className='absolute right-1 top-1 size-7 rounded-full bg-black/70 text-white hover:bg-black/90'>
            <IconX className='size-4' />
          </Button>
          <p className='max-w-32 truncate px-2 py-1 text-xs text-text-1'>{file.name}</p>
        </div>
      )}
      <div className='flex items-center gap-2 h-14  '>
        <Button onClick={handleUploadImage} type='button' variant='ghost' className='p-0 me-2'>
          <IconPlus className='text-text-1' />
        </Button>
        <Input
          value={message}
          onKeyDown={() => {
            handleTyping();
          }}
          onChange={e => setMessage(e.target.value)}
          className='border-none! bg-transparent! focus-visible:ring-0 placeholder:text-text-1'
          placeholder={placeholder}
        />
        <Button type='submit' disabled={isLoading || (!message.trim() && !file)} className={cn('opacity-50', (message.trim() || file) && 'opacity-100')}>
          {isLoading ? <IconLoader2 className='animate-spin' /> : <IconSend2 />}
        </Button>
      </div>
    </form>
  );
};

export default ChannelTextInput;
