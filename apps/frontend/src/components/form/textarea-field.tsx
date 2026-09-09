import React from 'react';
import {Field, FieldDescription, FieldError, FieldLabel} from '../ui/field';
import {Textarea} from '../ui/textarea';
import {Controller, type Control, type FieldValues, type UseControllerProps} from 'react-hook-form';
import {cn} from '@/lib/utils';

interface TextareaFieldProps<T extends FieldValues> {
  label?: string;
  labelClassName?: string;
  textareaClassName?: string;
  className?: string;
  control: Control<T>;
  register: UseControllerProps<T>;
  placeholder?: string;
  description?: string;
  props?: React.ComponentProps<'textarea'>;
}

function TextareaField<T extends FieldValues>({label, labelClassName, description, className, textareaClassName, placeholder, register, control, props}: TextareaFieldProps<T>) {
  return (
    <Controller
      {...register}
      control={control}
      render={({field, fieldState: {error, invalid}}) => (
        <Field className={cn(className)} data-invalid={invalid}>
          {label && (
            <FieldLabel htmlFor={props?.id} className={cn(labelClassName)}>
              {label}
            </FieldLabel>
          )}

          <Textarea {...field} {...props} placeholder={placeholder} className={cn(textareaClassName)} aria-invalid={invalid} />

          {description && <FieldDescription>{description}</FieldDescription>}

          {invalid && <FieldError errors={[error]} />}
        </Field>
      )}
    />
  );
}

export default TextareaField;
