import { CardContent } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import { programsData } from 'src/_mock';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import { hideScroll } from 'src/theme/css';

import CardTitle from '../components/card-title';
import GoBackButton from '../components/go-back-button';
import ProgramsNewEditForm from './programs-form';
import ProgramsList from './programs-list';

export default function Programs({
  open,
  onGoBack,
  onOpen,
  currentProgram,
  setCurrentProgram,
  ...other
}) {
  const { programs } = programsData;
  return (
    <Grid xs={12} md={4} disabled>
      <Card {...other} sx={{ height: 'calc(100vh - 150px)', ...hideScroll.y }}>
        <Scrollbar>
          {open ? (
            <GoBackButton
              onClick={onGoBack}
              title={currentProgram ? 'Editar Programa' : 'Novo Programa'}
            />
          ) : (
            <CardTitle title="Programas" />
          )}
          <CardContent>
            {open ? (
              <ProgramsNewEditForm currentProgram={currentProgram} onGoBack={onGoBack} />
            ) : (
              <>
                <Button
                  onClick={onOpen}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  Novo
                </Button>
                <ProgramsList setCurrentProgramEdit={setCurrentProgram} programs={programs} />
              </>
            )}
          </CardContent>
        </Scrollbar>
      </Card>
    </Grid>
  );
}

Programs.propTypes = {
  onGoBack: PropTypes.func,
  onOpen: PropTypes.func,
  open: PropTypes.bool,
  currentProgram: PropTypes.object,
  setCurrentProgram: PropTypes.func,
};
