import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const InviteLoading = () => {
  return (
    <div className='relative flex min-h-screen items-center justify-center bg-[#09090b] p-4 font-sans antialiased selection:bg-zinc-800 selection:text-zinc-100'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-zinc-500/5 blur-[120px] pointer-events-none rounded-full' />
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none' />

      <Card className='relative z-10 w-full max-w-[420px] rounded-[24px] border border-white/[0.05] bg-zinc-950/50 backdrop-blur-3xl shadow-2xl p-2'>
        <CardHeader className='flex flex-col items-center gap-5 pt-10 pb-4'>
          <Skeleton className='h-20 w-20 rounded-2xl bg-zinc-800/50' />
          <div className='flex flex-col items-center gap-3 w-full px-4'>
            <Skeleton className='h-8 w-48 rounded-lg bg-zinc-800/50' />
            <Skeleton className='h-4 w-full rounded-md bg-zinc-800/40' />
            <Skeleton className='h-4 w-3/4 rounded-md bg-zinc-800/40' />
          </div>
        </CardHeader>
        <CardContent className='flex flex-col items-center gap-4 pb-6 pt-2'>
          <Skeleton className='h-6 w-32 rounded-full bg-zinc-800/50' />
          <Skeleton className='h-20 w-full rounded-2xl bg-zinc-900/50' />
        </CardContent>
        <CardFooter className='flex flex-col gap-3 pb-8 px-8'>
          <Skeleton className='h-12 w-full rounded-xl bg-zinc-800/50' />
          <Skeleton className='h-10 w-full rounded-xl bg-zinc-800/30' />
        </CardFooter>
      </Card>
    </div>
  );
}

export default InviteLoading