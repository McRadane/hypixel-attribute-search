import { FormControl, Slider, Typography } from '@mui/material';
import { FC, useState } from 'react';

interface IRangeSliderProps {
  label: string;
  max: number;
  min: number;
  onChange: (newValue: [number, number]) => void;
}

export const RangeSlider: FC<IRangeSliderProps> = ({ label, max, min, onChange }) => {
  const [values, setValues] = useState<[number, number]>([min, max]);

  const handleOnChange = (_event: Event, newValue: number | number[]) => {
    const newNumbers = newValue as [number, number];

    if (newNumbers[0] > newNumbers[1]) {
      setValues([newNumbers[1], newNumbers[0]]);
      onChange([newNumbers[1], newNumbers[0]]);
    } else {
      setValues([newNumbers[0], newNumbers[1]]);
      onChange([newNumbers[0], newNumbers[1]]);
    }
  };

  return (
    <FormControl sx={{ flex: 1 }} variant="standard">
      <Typography>{label}</Typography>
      <Slider max={max} min={min} onChange={handleOnChange} value={values} valueLabelDisplay="auto" marks />
    </FormControl>
  );
};
