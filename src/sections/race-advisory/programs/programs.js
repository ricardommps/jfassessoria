import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import CustomizedAccordions from 'src/components/customized-accordions/customized-accordions';
import Iconify from 'src/components/iconify/iconify';
import { hideScroll } from 'src/theme/css';
import { fDate } from 'src/utils/format-time';

import ProgramNewEditForm from './program-form';
import ProgramsList from './programs-list';
export default function Programs({
  currentCustomer,
  currentProgram,
  openForm,
  onOpenForm,
  onCloseForm,
  onOpenTrainings,
  openTrainings,
  onCancel,
  handleGoBackTrainings,
}) {
  return (
    <Box sx={{ height: 'calc(100vh - 150px)', ...hideScroll.y }}>
      <Stack>
        {currentProgram && !openTrainings && (
          <Stack sx={{ float: 'right', display: 'block', marginRight: 2 }}>
            <Button variant="outlined" onClick={handleGoBackTrainings}>
              Editar Treino
            </Button>
          </Stack>
        )}

        <Stack>
          <Box>
            {!openForm && (
              <>
                <Button
                  onClick={onOpenForm}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  sx={{ mb: 2 }}
                >
                  Novo
                </Button>
              </>
            )}
            <CustomizedAccordions title="Dados do Aluno">
              <Box rowGap={3} columnGap={2} display="grid">
                <Stack sx={{ typography: 'body2' }}>
                  <Typography variant="subtitle2">Nome</Typography>
                  {currentCustomer?.name}
                </Stack>
                <Stack sx={{ typography: 'body2' }}>
                  <Typography variant="subtitle2">Data Nasc.</Typography>
                  {fDate(currentCustomer?.details?.birthdate, 'dd/MM/yyyy')}
                </Stack>
              </Box>
            </CustomizedAccordions>
            {openForm && (
              <ProgramNewEditForm
                currentCustomer={currentCustomer}
                currentProgram={currentProgram}
                onCloseForm={onCloseForm}
                onCancel={onCancel}
              />
            )}
            {!openForm && <ProgramsList onOpenTrainings={onOpenTrainings} />}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

Programs.propTypes = {
  currentCustomer: PropTypes.object,
  currentProgram: PropTypes.object,
  openForm: PropTypes.bool,
  onOpenForm: PropTypes.func,
  onCloseForm: PropTypes.func,
  onOpenTrainings: PropTypes.func,
  onCloseTrainings: PropTypes.func,
  onSelectProgram: PropTypes.func,
  openTrainings: PropTypes.bool,
  onCancel: PropTypes.func,
};
