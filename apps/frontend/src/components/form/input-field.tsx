import React from 'react';
import {Field, FieldDescription, FieldError, FieldLabel} from '../ui/field';
import {Input} from '../ui/input';
import {Controller, type Control, type FieldValues, type UseControllerProps} from 'react-hook-form';
import {cn} from '@/lib/utils';
import {IconLoader2} from '@tabler/icons-react';

interface InputFieldProps<T extends FieldValues> {
  label?: string;
  labelClassName?: string;
  inputClassName?: string;
  className?: string;
  control: Control<T>;
  register: UseControllerProps<T>;
  placeholder?: string;
  required?: boolean;
  description?: string;
  isLoading?: boolean;
  props?: React.ComponentProps<'input'>;
}

function InputField<T extends FieldValues>({label, labelClassName, isLoading = false, required = false, description, className, inputClassName, placeholder, register, control, props}: InputFieldProps<T>) {
  return (
    <Controller
      {...register}
      control={control}
      render={({field, fieldState: {error, invalid}}) => (
        <Field className={cn(className)}>
          {label && (
            <FieldLabel htmlFor={props?.id} className={cn(labelClassName)}>
              {label} {required && <span className='text-red-500'>*</span>}
            </FieldLabel>
          )}
          <div className='relative'>
            <Input {...field} placeholder={placeholder} {...props} className={cn(inputClassName)} />
            {isLoading && <IconLoader2 size={20} className='animate-spin absolute bottom-2 inset-e-2' />}
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          {invalid && <FieldError errors={[error]} />}
        </Field>
      )}
    />
  );
}

export default InputField;
