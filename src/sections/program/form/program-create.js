import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';

import ProgramCreateToolbar from './program-create-toolbar';
import ProgramGymForm from './program-gym-form';
import ProgramRunningForm from './program-running-form';
export default function ProgramCreate({ customer }) {
  const [typeProgram, setTypeProgram] = useState(1);
  return (
    <>
      <Grid container spacing={3} pt={2}>
        <Grid md={4}>
          <ProgramCreateToolbar typeProgram={typeProgram} setTypeProgram={setTypeProgram} />
        </Grid>
        <Grid xs={12} md={6}>
          <Card sx={{ pt: 2, pb: 5, px: 3 }}>
            <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold', color: '#f7951e' }}>
              Novo programa de {typeProgram === 1 ? 'corrida' : 'força'}
            </Typography>
            <Typography variant="h6">{customer.name}</Typography>
            {typeProgram === 1 && <ProgramRunningForm typeProgram={typeProgram} />}
            {typeProgram === 2 && <ProgramGymForm typeProgram={typeProgram} />}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
