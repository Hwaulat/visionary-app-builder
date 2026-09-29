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
              '!min-h-[38px] !px-2 border rounded-xl bg-background text-sm text-slate-600 dark:text-slate-300 shadow-none border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600',
              hasError && 'bg-white border-destructive',
              disabled && 'bg-muted text-muted-foreground',
            ),

          menu: () =>
            'mt-2 py-1 border rounded-xl text-sm border-slate-200 dark:border-slate-700 shadow-md bg-popover z-50 overflow-hidden',

          multiValue: () => 'gap-1 py-1 px-2 mr-1 bg-muted rounded',

          multiValueRemove: () => 'mt-0.5 px-0 mr-0 hover:text-destructive cursor-pointer',

          option: ({ isFocused, isSelected }) =>
            cn(
              '!flex items-center min-h-8 px-3 text-sm cursor-default hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors',
              (isFocused || isSelected) &&
                'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
            ),

          placeholder: ({ isDisabled }) =>
            cn('text-slate-400 dark:text-slate-500', isDisabled && 'opacity-50'),

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
