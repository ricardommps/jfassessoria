import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import CustomPopover from 'src/components/custom-popover';
import Iconify from 'src/components/iconify/iconify';

export const NEW_OPTIONS = [
  {
    value: 1,
    label: 'Versão 1',
  },
  {
    value: 2,
    label: 'Versão app',
  },
];

export default function TrainingListAction({
  type,
  volume,
  popover,
  programInfo,
  handleOpenCreateTraining,
  handleClose,
}) {
  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}
      >
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleClose}>
          Fechar
        </Button>

        {type === 1 && (
          <Button variant="contained" sx={{ mb: 2 }} onClick={volume.onTrue}>
            Volume
          </Button>
        )}
        <Button
          size="medium"
          color="inherit"
          variant="contained"
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          sx={{ textTransform: 'capitalize', mb: 2 }}
          onClick={popover.onOpen}
        >
          Novo treino
        </Button>
        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="top-right"
          sx={{ width: 'auto' }}
        >
          {NEW_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === 0}
              onClick={() => {
                popover.onClose();
                handleOpenCreateTraining(option.value);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </CustomPopover>
      </Stack>
      <Box pb={2}>
        <Alert variant="outlined" severity="info" onClick={programInfo.onTrue}>
          Informações do programa
        </Alert>
      </Box>
    </>
  );
}
