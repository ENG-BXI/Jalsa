import {ScrollArea} from '@/components/ui/scroll-area';
import {groupMessages} from './helper';
import MessageGroup from './message-group';
import type {TMessageWithUser} from './message-types';
import {useEffect, useRef} from 'react';

interface TAllMessageProps {
  messages: TMessageWithUser[];
}

const AllMessage = ({messages}: TAllMessageProps) => {
  const groups = groupMessages(messages);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    viewport.scrollTop = viewport.scrollHeight;
  }, [messages.length]);
  return (
    <ScrollArea ref={viewportRef} className='max-h-[calc(100dvh-140px)] h-full flex flex-col justify-end '>
      <div className='flex min-h-full flex-col justify-end'>
        {groups.map(group => (
          <MessageGroup key={group[0].id} messages={group} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default AllMessage;
