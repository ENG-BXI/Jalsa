import React from 'react';
import {Field, FieldDescription, FieldError, FieldLabel} from '../ui/field';
import {Input} from '../ui/input';
import {Controller, type Control, type FieldValues, type UseControllerProps} from 'react-hook-form';
import {cn} from '@/lib/utils';

interface InputFieldProps<T extends FieldValues> {
  label?: string;
  labelClassName?: string;
  inputClassName?: string;
  className?: string;
  control: Control<T>;
  register: UseControllerProps<T>;
  placeholder?: string;
  description?: string;
  props?: React.ComponentProps<'input'>;
}

function InputField<T extends FieldValues>({label, labelClassName, description, className, inputClassName, placeholder, register, control, props}: InputFieldProps<T>) {
  return (
    <Controller
      {...register}
      control={control}
      render={({field, fieldState: {error, invalid}}) => (
        <Field className={cn(className)}>
          {label && (
            <FieldLabel htmlFor={props?.id} className={cn(labelClassName)}>
              {label}
            </FieldLabel>
          )}
          <Input {...field} placeholder={placeholder} {...props} className={cn(inputClassName)} />
          {description && <FieldDescription>{description}</FieldDescription>}
          {invalid && <FieldError errors={[error]} />}
        </Field>
      )}
    />
  );
}

export default InputField;
