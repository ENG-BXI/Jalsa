import MessageItem from './message-item';
import type {TMessageWithUser} from './message-types';

interface MessageGroupProps {
  messages: TMessageWithUser[];
}

const MessageGroup = ({messages}: MessageGroupProps) => {
  return (
    <div className='py-1'>
      {messages.map((message, index) => (
        <MessageItem key={message.id} message={message} grouped={index > 0} />
      ))}
    </div>
  );
};

export default MessageGroup;
