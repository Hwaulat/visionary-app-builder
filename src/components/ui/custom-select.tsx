import { cn } from '@/lib/utils';
import { Label } from './label';
import { forwardRef } from 'react';
import SelectBase, {
  type SelectInstance,
  type Props as SelectProps,
} from 'react-select';

export type SelectOptionProps = {
  label: any;
  value: string;
  isDisabled?: boolean;
  optionImage?: React.ReactNode;
  optionLabel?: React.ReactNode;
};

type InfiniteScrollProps = {
  hasMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
};

type BaseSelectProps = Omit<
  SelectProps<SelectOptionProps, boolean>,
  'options' | 'onChange'
> & {
  datalist: SelectOptionProps[];
  label?: string;
  disabled?: boolean;
  hideClear?: boolean;
  errorMsg?: string;
  defValue?: string | string[];
  containerClassName?: string;
  infiniteScroll?: InfiniteScrollProps;
};

type SinglSelectProps = BaseSelectProps & {
  isMulti?: false;
  onChange?: (selected: string | null) => void;
};

type MultiSelectProps = BaseSelectProps & {
  isMulti: true;
  onChange?: (selected: string[]) => void;
};

export type CustomSelectProps = SinglSelectProps | MultiSelectProps;

const SelectInput = forwardRef<
  SelectInstance<SelectOptionProps, boolean>,
  CustomSelectProps
>(function SelectInput(
  {
    label,
    datalist,
    defValue,
    errorMsg,
    required,
    disabled,
    containerClassName,
    onChange,
    infiniteScroll,
    hideClear,
    ...props
  },
  ref,
) {
  const hasError = Boolean(errorMsg && errorMsg.trim());

  const defaultValue = Array.isArray(defValue)
    ? datalist.filter((item) => defValue.includes(item.value))
    : datalist.find((item) => item.value === defValue) || null;

  return (
    <div className={cn('flex flex-col gap-2 w-full', containerClassName)}>
      {label && (
        <Label>
          {label}
          {required && <sup className="text-red-500">*</sup>}
        </Label>
      )}

      <SelectBase
        ref={ref}
        options={datalist}
        isMulti={props.isMulti}
        isDisabled={disabled}
        isClearable={hideClear ? false : true}
        unstyled
        menuPosition="absolute"
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        menuShouldScrollIntoView={false}
        closeMenuOnSelect={!props.isMulti}
        defaultValue={defaultValue}
        placeholder={props.placeholder ?? 'Not Selected'}
        isOptionDisabled={(option) => !!option.isDisabled}
        onMenuScrollToBottom={() => {
          if (infiniteScroll?.hasMore && !infiniteScroll?.loading) {
            infiniteScroll.onLoadMore?.();
          }
        }}
        noOptionsMessage={() =>
          infiniteScroll?.loading ? 'Loading...' : 'No options'
        }
        onChange={(val) => {
          if (props.isMulti) {
            const values = Array.isArray(val)
              ? val.map((item) => item.value)
              : [];

            (onChange as MultiSelectProps['onChange'])?.(values);
          } else {
            const value = (val as SelectOptionProps | null)?.value;

            (onChange as SinglSelectProps['onChange'])?.(value ?? null);
          }
        }}
        classNames={{
          control: () =>
            cn(
              '!min-h-[38px] !px-3 border-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 font-medium shadow-none border-transparent hover:bg-slate-200/50 hover:border-slate-200 dark:border-transparent dark:hover:border-slate-600 focus-within:bg-white focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-colors',
              hasError && 'bg-white border-destructive',
              disabled && 'opacity-60 cursor-not-allowed',
            ),

          menu: () =>
            'mt-2 py-1 border rounded-2xl text-sm border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-900 z-50 overflow-hidden',

          multiValue: () => 'gap-1 py-1 px-3 mr-1 bg-slate-200 text-slate-700 font-medium rounded-full',

          multiValueRemove: () => 'mt-0.5 px-0 mr-0 hover:text-red-500 cursor-pointer',

          option: ({ isFocused, isSelected }) =>
            cn(
              '!flex items-center min-h-8 px-4 text-sm cursor-default hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors',
              (isFocused || isSelected) &&
                'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 font-medium',
            ),

          placeholder: ({ isDisabled }) =>
            cn('text-slate-400 font-normal dark:text-slate-500', isDisabled && 'opacity-50'),

          valueContainer: () => 'stroke-0 mr-2',
          
          indicatorSeparator: () => 'hidden',

          clearIndicator: () => 'stroke-0 mr-1 text-slate-400 cursor-pointer hover:text-slate-600',

          dropdownIndicator: () => 'stroke-0 mr-0 p-1 text-slate-400 cursor-pointer hover:text-slate-600',
        }}
        {...props}
      />

      {hasError && <p className="text-sm text-destructive">{errorMsg}</p>}
    </div>
  );
});

export { SelectInput };
