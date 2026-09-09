import {IconHash} from '@tabler/icons-react';

interface EmptyChannelPageProps {
  title: string;
}
const EmptyChannelPage = ({title}: EmptyChannelPageProps) => {
  return (
    <div className='min-h-full flex flex-col gap-2 justify-end pb-6'>
      <div className='bg-primary-3 max-w-min rounded-full p-2'>
        <IconHash size={50} />
      </div>
      <h1 className='text-3xl font-bold'>Welcome to #{title}!</h1>
      <p className='text-'>This is the start of the #{title} channel. </p>
    </div>
  );
};

export default EmptyChannelPage;
