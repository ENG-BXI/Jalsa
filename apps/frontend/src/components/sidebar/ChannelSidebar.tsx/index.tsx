import {Separator} from '@/components/ui/separator';
import ServerNameAndAction from './server-name-and-action';
import TextChannel from './channel/text-channel';
import {dummyTextChannels, dummyVoiceChannels} from './helper';
import VoiceChannel from './channel/voice-channel';

const ChannelSidebar = () => {
  return (
    <div className='w-50 bg-primary-2'>
      <ServerNameAndAction />
      <Separator />
      <div className='p-3 flex flex-col gap-4'>
        <TextChannel channels={dummyTextChannels} />
        <VoiceChannel channels={dummyVoiceChannels} />
      </div>
    </div>
  );
};

export default ChannelSidebar;
