import {cn} from 'cn';

interface IsTypingComponentsProps {
  name: string[];
  isTyping: boolean;
}
const IsTypingComponents = ({name, isTyping}: IsTypingComponentsProps) => {
  return (
    <div className={cn('pointer-events-none absolute bottom-19 right-4 z-10', 'flex items-center gap-2 rounded-full border border-border-1', 'bg-[#222327]/95 px-3 py-2 shadow-lg backdrop-blur-sm', 'transition-all duration-200', isTyping ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0')} aria-live='polite'>
      <div className='flex items-center gap-1'>
        {[0, 1, 2].map(dot => (
          <span key={dot} className='size-1.5 rounded-full bg-[#D4A72C] animate-bounce' style={{animationDelay: `${dot * 150}ms`}} />
        ))}
      </div>

      <span className='max-w-40 truncate text-xs text-text-1'>
        <span className='font-medium text-foreground'>{name.join(', ')}</span> is typing...
      </span>
    </div>
  );
};

export default IsTypingComponents;
