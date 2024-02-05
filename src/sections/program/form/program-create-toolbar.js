import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
export default function ProgramCreateToolbar({ typeProgram, setTypeProgram }) {
  const handleChange = (event) => {
    setTypeProgram(Number(event.target.value));
  };
  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral', borderRadius: 2 }}
    >
      <FormControl>
        <FormLabel sx={{ typography: 'body2', color: 'text.primary' }}>Tipo</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={typeProgram}
          onChange={handleChange}
        >
          <FormControlLabel value={1} control={<Radio />} label="Corrida" />
          <FormControlLabel value={2} control={<Radio />} label="Força" />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}
