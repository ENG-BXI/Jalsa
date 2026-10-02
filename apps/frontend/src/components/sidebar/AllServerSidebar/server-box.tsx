import {cn, formatText} from '@/lib/utils';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';

import type {TServerBoxType, TSideBardServer} from '../type';
import {useLocation, useNavigate, useParams} from 'react-router';
import {useAppDialog} from '@/store/dialog-store';
import CreateServerForm from '../../server/create-server-form';

function getPath(name: string, type: TServerBoxType = 'server') {
  if (type == 'direct') return 'direct-message';
  else if (type == 'server') return `server/${name}`;
  else if (type == 'community') return `community`;
  else return '';
}

const ServerBox = ({server, className}: {server: TSideBardServer; className?: string}) => {
  const navigate = useNavigate();
  const {setDialog, onClose} = useAppDialog();
  const params = useParams<{serverName: string}>();
  const local = useLocation();
  const pathName = local.pathname;
  const isDirect = pathName == '/direct-message';
  const isCommunity = pathName == '/community';
  const isActive = (!isCommunity && !isDirect && server.name == params.serverName) || (isDirect && server.type == 'direct' && !params.serverName) || (isCommunity && server.type == 'community' && !params.serverName);
  const path = getPath(server.name, server.type);
  const Icon = server.icon;
  function onClick() {
    if (server.type == 'create-server') {
      setDialog({
        title: {
          title: 'Create Your Server',
          className: 'text-center'
        },

        description: {
          description: 'Create a server and start building your own community.',
          className: 'text-center'
        },

        content: <CreateServerForm onClose={onClose} />,

        primaryAction: {
          text: 'Create Server',
          formId: 'create-server-form'
        },

        secondaryAction: {
          text: 'Cancel'
        }
      });
    } else navigate(path);
  }
  return (
    <Tooltip>
      <TooltipTrigger onClick={onClick} delay={50} render={<div className={cn('relative group cursor-pointer', 'not-last-of-type:mb-2.5', className)} />}>
        {server.image ? (
          <div className='size-11 flex justify-center items-center rounded-lg text-xs overflow-hidden'>
            <img src={server.image} alt={server.name} className='size-full! rounded-lg object-cover' />
          </div>
        ) : Icon ? (
          <div className='size-11 flex justify-center items-center rounded-lg text-xs bg-indigo-400'>
            <Icon />
          </div>
        ) : (
          <div className='size-11 flex justify-center items-center rounded-lg text-xs bg-indigo-400'>
            {formatText(server.name, {
              numOfLetter: 4,
              mode: 'first-letter-of-words'
            })}
          </div>
        )}

        <div className={cn('absolute duration-300 top-1/2 -translate-y-1/2 -left-6', 'group-hover:h-4 bg-white h-2 w-3 rounded-full', isActive && 'h-full duration-100 group-hover:h-full')} />
      </TooltipTrigger>

      <TooltipContent side='right' className={'bg-dialog-primary text-sm text-foreground'}>
        {server.name}
      </TooltipContent>
    </Tooltip>
  );
};

export default ServerBox;
