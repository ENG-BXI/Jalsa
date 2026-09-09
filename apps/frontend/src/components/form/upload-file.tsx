import React from 'react';
import {Field, FieldDescription, FieldError, FieldLabel} from '../ui/field';
import {Button} from '../ui/button';
import {Controller, type Control, type FieldValues, type UseControllerProps} from 'react-hook-form';
import {cn} from '@/lib/utils';
import {IconUpload, IconX} from '@tabler/icons-react';

interface FileUploadFieldProps<T extends FieldValues> {
  label?: string;
  labelClassName?: string;
  inputClassName?: string;
  className?: string;
  control: Control<T>;
  register: UseControllerProps<T>;
  description?: string;
  accept?: string;
  multiple?: boolean;
  props?: React.ComponentProps<'input'>;
}

function FileUploadField<T extends FieldValues>({label, labelClassName, inputClassName, className, control, register, description, accept, multiple = false, props}: FileUploadFieldProps<T>) {
  return (
    <Controller
      {...register}
      control={control}
      render={({field, fieldState: {error, invalid}}) => {
        const files = field.value ? (multiple ? Array.from(field.value as FileList) : [field.value as File]) : [];

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const selectedFiles = event.target.files;

          if (!selectedFiles || selectedFiles.length === 0) {
            field.onChange(null);
            return;
          }

          field.onChange(multiple ? selectedFiles : selectedFiles[0]);
        };

        const removeFile = (index: number) => {
          if (multiple) {
            const newFiles = files.filter((_, i) => i !== index);
            field.onChange(newFiles);
          } else {
            field.onChange(null);
          }
        };

        return (
          <Field className={cn(className)} data-invalid={invalid}>
            {label && (
              <FieldLabel htmlFor={props?.id} className={cn(labelClassName)}>
                {label}
              </FieldLabel>
            )}

            <div className={cn('rounded-md border border-dashed p-4', inputClassName)}>
              <label htmlFor={props?.id} className='flex cursor-pointer flex-col items-center justify-center gap-2'>
                <IconUpload className='size-5' />
                <span className='text-sm font-medium'>Click to upload</span>

                <span className='text-xs text-muted-foreground'>{accept ? `Accepted: ${accept}` : 'Select a file from your device'}</span>

                <input {...props} id={props?.id} type='file' accept={accept} multiple={multiple} onChange={handleChange} className='hidden' />
              </label>

              {files.length > 0 && (
                <div className='mt-4 space-y-2'>
                  {files.map((file, index) => (
                    <div key={`${file.name}-${index}`} className='flex items-center justify-between rounded-md border p-2'>
                      <div className='min-w-0'>
                        <p className='truncate text-sm font-medium'>{file.name}</p>

                        <p className='text-xs text-muted-foreground'>{(file.size / 1024).toFixed(1)} KB</p>
                      </div>

                      <Button type='button' variant='ghost' size='icon' onClick={() => removeFile(index)}>
                        <IconX className='size-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {description && <FieldDescription>{description}</FieldDescription>}

            {invalid && <FieldError errors={[error]} />}
          </Field>
        );
      }}
    />
  );
}

export default FileUploadField;
