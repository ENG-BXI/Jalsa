import {Input} from '@/components/ui/input';
import {IconPlus} from '@tabler/icons-react';
interface ChannelTextInputProps {
  placeholder?: string;
}
const ChannelTextInput = ({placeholder}: ChannelTextInputProps) => {
  return (
    <div className='h-14 absolute bottom-0 left-0 right-0 mx-2 my-2 bg-[#222327] rounded-md flex items-center px-4 focus-visible:border border-border-1'>
      <IconPlus className='text-text-1' />
      <Input className='border-none! bg-transparent! focus-visible:ring-0 placeholder:text-text-1' placeholder={placeholder} />
    </div>
  );
};

export default ChannelTextInput;
