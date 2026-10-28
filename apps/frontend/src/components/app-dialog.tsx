import {Button} from '@/components/ui/button';
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {ScrollArea} from '@/components/ui/scroll-area';
import {cn} from '@/lib/utils';
import {useAppDialog} from '@/store/dialog-store';

export function AppDialog() {
  const {dialog, disabled, onClose} = useAppDialog();

  return (
    <Dialog defaultOpen={!!disabled} open={!!dialog || !!disabled} onOpenChange={() => !disabled && onClose()}>
      <DialogContent className='sm:max-w-lg bg-dialog-primary'>
        <DialogHeader>
          <DialogTitle className={cn('text-xl font-bold', typeof dialog?.title != 'string' && dialog?.title.className)}>{typeof dialog?.title == 'string' ? dialog.title : dialog?.title.title}</DialogTitle>

          {dialog?.description && <DialogDescription className={cn(typeof dialog?.description != 'string' && dialog?.description.className)}>{typeof dialog.description == 'string' ? dialog.description : dialog.description.description}</DialogDescription>}
        </DialogHeader>

        <ScrollArea className='max-h-130'>
          <div className={cn('px-1', dialog?.className)}>{dialog?.content}</div>
        </ScrollArea>

        {(dialog?.primaryAction || dialog?.secondaryAction) && (
          <DialogFooter>
            {dialog?.secondaryAction && (
              <DialogClose
                render={
                  <Button
                    type='button'
                    variant='outline'
                    disabled={dialog.secondaryAction.disabled}
                    className={cn(dialog.secondaryAction.className)}
                    onClick={() => {
                      dialog.secondaryAction?.onClick?.();
                    }}
                  >
                    {dialog.secondaryAction.text}
                  </Button>
                }
              />
            )}

            {dialog?.primaryAction && (
              <Button
                type='submit'
                disabled={dialog.primaryAction.disabled}
                form={dialog.primaryAction.formId}
                className={cn(dialog.primaryAction.className)}
                onClick={() => {
                  dialog.primaryAction?.onClick?.();
                }}
              >
                {dialog.primaryAction.text}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
