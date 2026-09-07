import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {formatText} from '@/lib/utils';
import {useState} from 'react';

interface ChannelNameProps {
  title: string;
  isOpen: boolean;
}
function ChannelName({title, isOpen}: ChannelNameProps) {
  const [isHover, setIsHover] = useState(false);
  const NUMBER_OF_LETTER_WHEN_CHANNEL_OPEN = 10;
  const NUMBER_OF_LETTER_WHEN_CHANNEL_NOT_OPEN = 13;
  const formattedText = formatText(title, {numOfLetter: isOpen || isHover ? NUMBER_OF_LETTER_WHEN_CHANNEL_OPEN : NUMBER_OF_LETTER_WHEN_CHANNEL_NOT_OPEN});
  // For Show a toolTip only when Name is Long
  return title.length > NUMBER_OF_LETTER_WHEN_CHANNEL_OPEN ? (
    <Tooltip>
      <TooltipTrigger onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className={'cursor-pointer'}>
        {formattedText}
      </TooltipTrigger>
      <TooltipContent className={'bg-dialog-primary text-sm text-foreground'}>{title}</TooltipContent>
    </Tooltip>
  ) : (
    title
  );
}

export default ChannelName;
