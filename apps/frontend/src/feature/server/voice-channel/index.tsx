import {useJoinStreamChannel} from '@/api/channel/api';
import {useChannel} from '@/store/use-channel';
import {useUser} from '@/store/user-info-store';
import client from '@/stream/setup';
import {CallingState, StreamTheme, CallControls, useCallStateHooks, StreamVideo, StreamCall, Call, type User, SpeakerLayout} from '@stream-io/video-react-sdk';
import {IconVideoOff} from '@tabler/icons-react';
import {useEffect, useState} from 'react';

import '@stream-io/video-react-sdk/dist/css/styles.css';

function VoiceChannelPage() {
  const [call, setCall] = useState<Call>();
  const {channel} = useChannel();
  const user = useUser(state => state.user);
  const {data} = useJoinStreamChannel(channel.id, {select: data => data.data.data});
  async function handleJoinCall() {
    if (!user) return;

    const connectUser: User = {
      id: user.id,
      name: user.userName,
      type: 'authenticated',
      language: 'en'
    };
    const token = data?.streamToken;
    await client.connectUser(connectUser, token);
    const call = client.call('default', channel.id, {reuseInstance: true});
    setCall(call);
    await call.join({create: true, notify: true, allowOwnTracksLoopback: true, video: true});
    // call.camera.enable();
  }

  useEffect(() => {
    if (data?.streamToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleJoinCall();
      console.log('Calling');
    }

    return () => {
      client.disconnectUser();
    };
  }, [data?.streamToken, channel.id]);

  if (!call)
    return (
      <section className='flex h-full min-h-0 flex-col items-center justify-center gap-3 rounded-lg bg-primary-1 text-[#F2F2F3]'>
        <div className='flex size-16 items-center justify-center rounded-full bg-primary-3'>
          <IconVideoOff className='size-7 text-text-1' />
        </div>

        <p className='text-sm font-medium'>Setting up call...</p>
      </section>
    );

  return (
    <div className='h-full'>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme className='h-full'>
            <MyUILayout />
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
    </div>
  );
}

export default VoiceChannelPage;

export const MyUILayout = () => {
  const {useCallCallingState} = useCallStateHooks();

  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    const isEnded = callingState === CallingState.LEFT;

    const status = {
      [CallingState.UNKNOWN]: 'Setting up call...',
      [CallingState.IDLE]: 'Call is idle',
      [CallingState.RINGING]: 'Call is ringing...',
      [CallingState.JOINING]: 'Joining call...',
      [CallingState.RECONNECTING]: 'Connection lost, reconnecting...',
      [CallingState.RECONNECTING_FAILED]: 'Failed to reconnect',
      [CallingState.MIGRATING]: 'Migrating connection...',
      [CallingState.OFFLINE]: 'You are offline',
      [CallingState.LEFT]: 'You left the call',
      [CallingState.JOINED]: ''
    } satisfies Record<CallingState, string>;

    return (
      <section className='flex h-full min-h-0 flex-col items-center justify-center gap-3 rounded-lg bg-primary-1 text-[#F2F2F3]'>
        <div className='flex size-16 items-center justify-center rounded-full bg-primary-3'>
          <IconVideoOff className='size-7 text-text-1' />
        </div>

        <p className='text-sm font-medium'>{status[callingState]}</p>

        {isEnded && <p className='text-xs text-text-1'>You can return to the channel to join again.</p>}
      </section>
    );
  }

  return (
    <section className='flex p-3 h-full flex-col'>
      <SpeakerLayout />
      <CallControls />
    </section>
  );
};
