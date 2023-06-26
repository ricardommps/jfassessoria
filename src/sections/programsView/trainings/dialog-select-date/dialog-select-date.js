import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PropTypes from 'prop-types';
import DialogContent from 'src/components/dialog-custom/dialog-content';
import CustomizedDialogs from 'src/components/dialog-custom/dialog-custom';
import DialogTitleImage from 'src/components/dialog-custom/dialog-title-image';

import { StyledDialogActions, SubTitle } from './styles';
export function DialogSelectDate({ open, handleClose }) {
  return (
    <CustomizedDialogs onClose={handleClose} open={open}>
      <DialogTitleImage>
        <>
          <img src="/assets/icons/custom/icon-timer.svg" />
          Escolha a data para este treino ser liberado.
        </>
      </DialogTitleImage>
      <DialogContent>
        <SubTitle>
          Os treinos programados serão liberados e exibidos automaticamente dentro do programa do
          aluno.
        </SubTitle>
        <DatePicker
          label="Escolha uma data"
          slotProps={{
            textField: {
              variant: 'standard',
              sx: { width: '95%', pb: 2 },
              InputProps: { sx: { color: '#444' } },
            },
          }}
        />
      </DialogContent>
      <StyledDialogActions>
        <h3>Expiração Atual: </h3>
        <LoadingButton
          fullWidth
          color="inherit"
          variant="outlined"
          sx={{ mb: 1 }}
          onClick={handleClose}
        >
          Liberar
        </LoadingButton>
        <Button fullWidth color="inherit" variant="outlined" sx={{ mb: 1 }} onClick={handleClose}>
          Cancelar
        </Button>
        <LoadingButton
          fullWidth
          color="info"
          variant="contained"
          sx={{ mb: 1 }}
          onClick={handleClose}
        >
          Salvar
        </LoadingButton>
      </StyledDialogActions>
    </CustomizedDialogs>
  );
}

DialogSelectDate.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
