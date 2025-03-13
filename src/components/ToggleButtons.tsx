import { FormGroup, FormLabel, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FC, MouseEvent, useState } from 'react';

export interface IToggleButtonsProps {
  label: string;
  onChange: (value: string) => void;
  options: { text: string; value: string }[];
}

export const ToggleButtons: FC<IToggleButtonsProps> = ({ label, onChange, options }) => {
  const [value, setValue] = useState(options[0].value);
  const handleOnChange = (_event: MouseEvent<HTMLElement>, value: string) => {
    setValue(value);
    onChange(value);
  };

  return (
    <FormGroup sx={{ alignItems: 'center', flex: 1, flexDirection: 'row', gap: 1, justifyContent: 'center', padding: 1 }}>
      <FormLabel>{label}</FormLabel>
      <ToggleButtonGroup aria-label={label} color="primary" onChange={handleOnChange} size="small" value={value} exclusive>
        {options.map((option) => (
          <ToggleButton key={option.value} value={option.value}>
            {option.text}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </FormGroup>
  );
};
