import {IconSearch} from '@tabler/icons-react';

import {Input} from '@/components/ui/input';

type CommunitySearchProps = {
  value: string;
  onChange: (value: string) => void;
};

const CommunitySearch = ({value, onChange}: CommunitySearchProps) => {
  return (
    <div className='relative mx-auto w-full max-w-xl'>
      <IconSearch className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-1' />

      <Input value={value} onChange={event => onChange(event.target.value)} placeholder='Search communities' className='h-11 border-border-1 bg-primary-1 pl-9' />
    </div>
  );
};

export default CommunitySearch;
