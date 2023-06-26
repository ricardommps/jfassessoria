import { CardContent } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import CardTitle from 'src/sections/programsView/components/card-title';
import { hideScroll } from 'src/theme/css';

import { StudentsList } from './students-list';

export function Students({ handleSelectCurrentCustomer }) {
  return (
    <Grid xs={12} md={8} disabled>
      <Card sx={{ height: 'calc(100vh - 150px)', ...hideScroll.y }}>
        <Scrollbar>
          <CardTitle title="Alunos" />
          <CardContent>
            <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>
              Novo
            </Button>
            <Card sx={{ backgroundColor: 'rgba(22, 28, 36, 0.8)', mt: 3 }}>
              <StudentsList handleSelectCurrentCustomer={handleSelectCurrentCustomer} />
            </Card>
          </CardContent>
        </Scrollbar>
      </Card>
    </Grid>
  );
}

Students.propTypes = {
  handleSelectCurrentCustomer: PropTypes.func,
};
