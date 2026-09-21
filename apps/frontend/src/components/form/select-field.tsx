import {Controller, type Control, type FieldValues, type UseControllerProps} from 'react-hook-form';

import {cn} from '@/lib/utils';

import {Field, FieldDescription, FieldError, FieldLabel} from '../ui/field';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select';

type SelectOption = {
  label: string;
  value: string;
};

interface SelectFieldProps<T extends FieldValues> {
  label?: string;
  labelClassName?: string;
  className?: string;
  control: Control<T>;
  register: UseControllerProps<T>;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  description?: string;
  disabled?: boolean;
}

function SelectField<T extends FieldValues>({label, labelClassName, className, control, register, options, placeholder = 'Select an option', required = false, description, disabled = false}: SelectFieldProps<T>) {
  return (
    <Controller
      {...register}
      control={control}
      render={({field, fieldState: {error, invalid}}) => (
        <Field className={cn(className)}>
          {label && (
            <FieldLabel className={cn(labelClassName)}>
              {label} {required && <span className='text-red-500'>*</span>}
            </FieldLabel>
          )}

          <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {description && <FieldDescription>{description}</FieldDescription>}

          {invalid && <FieldError errors={[error]} />}
        </Field>
      )}
    />
  );
}

export default SelectField;
