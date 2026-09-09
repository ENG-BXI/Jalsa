import {Separator} from '@/components/ui/separator';
import ServerNameAndAction from './server-name-and-action';
import {dummyTextChannels, dummyVoiceChannels} from './helper';
import {ScrollArea} from '@/components/ui/scroll-area';
import Channel from './channel/channel';

const ChannelSidebar = () => {
  return (
    <div className='w-50 h-full flex flex-col bg-primary-2'>
      <ServerNameAndAction />
      <Separator />
      <ScrollArea className='p-3 h-full'>
        <Channel type='text' channels={dummyTextChannels} />
        <Channel type='voice' channels={dummyVoiceChannels} />
        <div className='h-10 w-full' />
      </ScrollArea>
    </div>
  );
};

export default ChannelSidebar;
