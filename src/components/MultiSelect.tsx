import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Box, Checkbox, TextField } from '@mui/material';
import { FC, HTMLAttributes, Key, SyntheticEvent, useCallback, useMemo, useState } from 'react';

interface IMultiSelectProps {
  label: string;
  maxItems?: number;
  onChange: (newValues: string[]) => void;
  values: { text: string; value: string }[] | string[];
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const MultiSelect: FC<IMultiSelectProps> = ({ label, maxItems, onChange, values }) => {
  const normalizedValues = useMemo(() => {
    const normalized: { text: string; value: string }[] = [];

    values.forEach((item) => {
      const text = typeof item === 'object' ? item.text : item;
      const value = typeof item === 'object' ? item.value : item;

      normalized.push({ text: text.toString(), value: value.toString() });
    });

    return [...normalized].sort((a, b) => a.text.localeCompare(b.text));
  }, [values]);

  const [value, setValue] = useState<
    {
      text: string;
      value: string;
    }[]
  >([]);

  const [limitReached, setLimitReached] = useState(false);

  const handleOnChange = useCallback(
    (_event: SyntheticEvent<Element, Event>, value: { text: string; value: string }[] | null) => {
      if (value) {
        setValue(value);
        onChange(value.map((v) => v.value));
        if (maxItems) {
          setLimitReached(value.length >= maxItems);
        }
      }
    },
    [maxItems, onChange]
  );

  const handleGetOptionLabel = useCallback((option: { text: string; value: string }) => option.text, []);

  const handleRenderOption = useCallback(
    (
      props: HTMLAttributes<HTMLLIElement> & {
        key: Key;
      },
      option: {
        text: string;
        value: string;
      },
      { selected }: { selected: boolean }
    ) => {
      const { key, ...optionProps } = props;

      return (
        <Box component="li" key={key} sx={{ '& > img': { flexShrink: 0, mr: 2 } }} {...optionProps}>
          <Checkbox checked={selected} checkedIcon={checkedIcon} icon={icon} style={{ marginRight: 8 }} />
          {option.text}
        </Box>
      );
    },
    []
  );

  const checkDisable = useCallback(
    (option: { text: string; value: string }) => {
      return limitReached && value.find((v) => v.value === option.value) === undefined;
    },
    [limitReached, value]
  );

  return (
    <Autocomplete
      renderInput={(params) => (
        <TextField
          {...params}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              autoComplete: 'new-password' // disable autocomplete and autofill
            }
          }}
          label={label}
        />
      )}
      getOptionDisabled={checkDisable}
      getOptionLabel={handleGetOptionLabel}
      onChange={handleOnChange}
      options={normalizedValues}
      renderOption={handleRenderOption}
      sx={{ flex: 1 }}
      value={value}
      disableCloseOnSelect
      disablePortal
      multiple
    />
  );
};
