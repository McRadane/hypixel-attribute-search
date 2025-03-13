import { Autocomplete, Box, TextField } from '@mui/material';
import { FC, HTMLAttributes, Key, SyntheticEvent, useCallback, useMemo, useState } from 'react';

interface ISelectProps {
  allowEmpty?: boolean;
  label: string;
  onChange: (newValue: string) => void;
  values: { text: string; value: string }[] | string[];
}

export const Select: FC<ISelectProps> = ({ allowEmpty, label, onChange, values }) => {
  const normalizedValues = useMemo(() => {
    let normalized: { text: string; value: string }[] = [];

    values.forEach((item) => {
      const text = typeof item === 'object' ? item.text : item;
      const value = typeof item === 'object' ? item.value : item;

      normalized.push({ text: text.toString(), value: value.toString() });
    });

    normalized = [...normalized].sort((a, b) => a.text.localeCompare(b.text));

    if (allowEmpty) {
      return [{ text: '-', value: '' }, ...normalized];
    }

    return normalized;
  }, [allowEmpty, values]);

  const [value, setValue] = useState<{
    text: string;
    value: string;
  }>(allowEmpty ? { text: '-', value: '' } : normalizedValues[0]);

  const [inputValue, setInputValue] = useState(allowEmpty ? '' : normalizedValues[0].text);

  const handleOnChange = useCallback(
    (_event: SyntheticEvent<Element, Event>, value: { text: string; value: string } | null) => {
      if (value) {
        setValue(value);
        onChange(value.value);
      }
    },
    [onChange]
  );

  const handleOnInputChange = useCallback((_event: SyntheticEvent<Element, Event>, newInputValue: string) => {
    setInputValue(newInputValue);
  }, []);

  const handleGetOptionLabel = useCallback((option: { text: string; value: string }) => option.text, []);

  const handleRenderOption = useCallback(
    (
      props: HTMLAttributes<HTMLLIElement> & {
        key: Key;
      },
      option: {
        text: string;
        value: string;
      }
    ) => {
      const { key, ...optionProps } = props;
      return (
        <Box component="li" key={key} sx={{ '& > img': { flexShrink: 0, mr: 2 } }} {...optionProps}>
          {option.text}
        </Box>
      );
    },
    []
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
      getOptionLabel={handleGetOptionLabel}
      inputValue={inputValue}
      onChange={handleOnChange}
      onInputChange={handleOnInputChange}
      options={normalizedValues}
      renderOption={handleRenderOption}
      sx={{ flex: 1 }}
      value={value}
      disablePortal
    />
  );
  /*return (
    <FormControl sx={{ flex: 1 }} variant="standard">
      <Typography id={`${id}-label`}>{label}</Typography>
      <MUISelect
        id={id}
        aria-describedby={`${id}-description`}
        aria-labelledby={`${id}-label`}
        label={label}
        onChange={handleValue}
        value={value}
      >
        {normalizedValues.map(({ text, value }) => {
          return (
            <MenuItem key={`${id}-${value}`} value={value}>
              {text}
            </MenuItem>
          );
        })}
      </MUISelect>
      <FormHelperText id={`${id}-description`}>{description}</FormHelperText>
    </FormControl>
  );*/
};
