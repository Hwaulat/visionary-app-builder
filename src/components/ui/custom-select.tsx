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
              '!min-h-[36px] !px-3 border rounded-lg bg-background text-sm border-input',
              hasError && 'bg-white border-destructive',
              disabled && 'bg-muted text-muted-foreground',
            ),

          menu: () =>
            'mt-2 py-1 border rounded-lg text-sm border-border shadow-md bg-popover z-50',

          multiValue: () => 'gap-1 py-1 px-2 mr-1 bg-muted rounded',

          multiValueRemove: () => 'mt-0.5 px-0 mr-0 hover:text-destructive cursor-pointer',

          option: ({ isFocused, isSelected }) =>
            cn(
              '!flex items-center min-h-8 px-3 text-sm cursor-default hover:bg-accent hover:text-accent-foreground',
              (isFocused || isSelected) &&
                'bg-accent text-accent-foreground',
            ),

          placeholder: ({ isDisabled }) =>
            cn('text-muted-foreground', isDisabled && 'text-muted-foreground/50'),

          valueContainer: () => 'stroke-0 mr-2',

          clearIndicator: () => 'stroke-0 mr-1 text-muted-foreground cursor-pointer hover:text-foreground',

          dropdownIndicator: () => 'stroke-0 mr-0 text-muted-foreground cursor-pointer hover:text-foreground',
        }}
        {...props}
      />

      {hasError && <p className="text-sm text-destructive">{errorMsg}</p>}
    </div>
  );
});

export { SelectInput };
