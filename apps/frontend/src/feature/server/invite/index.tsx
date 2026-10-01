import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {IconLoader2, IconUsers, IconWorld, IconLock, IconArrowRight} from '@tabler/icons-react';
import InviteLoading from './components/invite-loading';
import {useNavigate, useParams} from 'react-router';
import {useAddUserToPrivateServer, useNumberOfMembersInServer, useServerByName} from '@/api/server/api';
import {AxiosError} from 'axios';
import {Skeleton} from '@/components/ui/skeleton';

const InvitePage = () => {
  const params = useParams();
  const serverName = params.serverName as string;
  const inviteCode = params.inviteCode as string;
  const navigate = useNavigate();
  const {data: server, isLoading: isServerLoading} = useServerByName(serverName, {select: res => res.data.data, enabled: !!serverName});
  const {data: numberOfMembers, isLoading: isNumberOfMembersLoading} = useNumberOfMembersInServer(server?.id, {select: res => res.data.data, enabled: !!server?.id});
  const isPublic = server?.isPublic;
  const {mutate: addUserToPrivateServer, isPending: isAddingUserLoading} = useAddUserToPrivateServer();
  const isLoading = isServerLoading;
  const handleJoin = () => {
    if (!server || !inviteCode) return;
    addUserToPrivateServer(
      {serverId: server.id, inviteCode},
      {
        onSuccess: () => {
          navigate(`/server/${server.name}`);
        },
        onError: error => {
          if (error instanceof AxiosError) {
            if (error.response?.data.error == 'you are already a member of this server') navigate(`/server/${server.name}`);
          }
        }
      }
    );
  };
  function handleContinueToApp() {
    if (!server) return;
    navigate(`/`);
  }

  if (isLoading) {
    return <InviteLoading />;
  }

  return (
    <div className='relative flex min-h-screen items-center justify-center bg-[#09090b] p-4 font-sans antialiased selection:bg-zinc-800 selection:text-zinc-100'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-gradient-to-tr from-zinc-500/10 via-zinc-400/5 to-transparent blur-[120px] pointer-events-none rounded-full' />
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none' />

      <Card className='relative z-10 w-full max-w-[420px] rounded-[24px] border border-white/[0.08] bg-zinc-950/60 backdrop-blur-3xl shadow-[0_0_80px_-20px_rgba(0,0,0,1)] p-2 transition-all duration-700 animate-in fade-in slide-in-from-bottom-4 overflow-hidden'>
        <div className='absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-400/30 to-transparent' />

        <CardHeader className='flex flex-col items-center gap-5 pt-10 pb-4'>
          <div>
            <div className='relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-800/80 to-zinc-950 shadow-2xl'>
              <span className='text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-500'>J</span>
            </div>
          </div>

          <div className='space-y-3 text-center px-2'>
            <h1 className='text-3xl font-bold tracking-tight text-zinc-100'>{server?.name} Server</h1>
            <p className='text-sm leading-relaxed text-zinc-400'>{server?.description}</p>
          </div>
        </CardHeader>

        <CardContent className='flex flex-col items-center gap-5 pt-2 pb-6 px-6'>
          <div className='flex items-center gap-2 text-sm font-medium text-zinc-300'>
            <IconUsers className='h-4.5 w-4.5 text-zinc-400' />
            {isNumberOfMembersLoading ? <Skeleton className='w-50 h-4 rounded-sm bg-gray-800' /> : <span>{numberOfMembers?.userSevers} Members</span>}
          </div>

          <div className='w-full rounded-2xl border border-white/[0.04] bg-zinc-900/40 p-4 flex items-start gap-3'>
            <div className='p-2 rounded-xl bg-zinc-800/50 text-zinc-300 mt-0.5'>{isPublic ? <IconWorld className='h-4 w-4' /> : <IconLock className='h-4 w-4' />}</div>
            <div className='flex flex-col gap-1'>
              <span className='text-sm font-semibold text-zinc-200'>{isPublic ? 'Public Server' : 'Private Server'}</span>
              <span className='text-xs leading-relaxed text-zinc-500'>{isPublic ? 'This is an open community. Anyone with this invitation link can join and participate in the workspace.' : 'This is a private community. Access is restricted and requires this exclusive invitation to join.'}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className='flex flex-col gap-3 pb-8 px-8'>
          <Button className='group relative h-12 w-full overflow-hidden rounded-xl bg-zinc-100 text-sm font-bold text-zinc-950 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all duration-300 hover:bg-white active:scale-[0.98] disabled:opacity-80' onClick={handleJoin} disabled={isAddingUserLoading}>
            {isAddingUserLoading ? (
              <span className='flex items-center justify-center gap-2'>
                <IconLoader2 className='h-4 w-4 animate-spin text-zinc-600' />
                Joining Community...
              </span>
            ) : (
              <span className='flex items-center justify-center gap-2'>
                Accept Invitation
                <IconArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
              </span>
            )}
          </Button>

          <Button onClick={handleContinueToApp} variant='ghost' className='h-10 w-full rounded-xl text-xs font-semibold text-zinc-500 transition-colors hover:bg-zinc-800/50 hover:text-zinc-300'>
            Continue to App
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvitePage;
