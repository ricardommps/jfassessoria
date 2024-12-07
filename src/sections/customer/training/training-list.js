import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import DialogProvider from 'src/app/context/dialog-provider';
import Iconify from 'src/components/iconify/iconify';
import LoadingProgress from 'src/components/loading-progress';
import { useBoolean } from 'src/hooks/use-boolean';

import CreateTraining from './training-form/create-training';
import TrainingItem from './training-item';
export default function TrainingList({
  loading,
  trainings,
  trainingsStatus,
  handleClose,
  programId,
  type,
  refreshList,
}) {
  const create = useBoolean();
  const handleCloseCreate = () => {
    create.onFalse();
  };

  const handleSuccessCreate = () => {
    create.onFalse();
    refreshList();
  };
  return (
    <DialogProvider>
      <Box>
        {loading && <LoadingProgress />}
        {!loading && (
          <>
            <Box p={2}>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                }}
              >
                <Button variant="contained" sx={{ mb: 2 }} onClick={handleClose}>
                  Fechar
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  sx={{ mb: 2 }}
                  onClick={create.onTrue}
                >
                  Novo treino
                </Button>
              </Stack>
              <Stack spacing={2}>
                {(!trainingsStatus.loading || !loading) && !trainingsStatus.empty && trainings && (
                  <>
                    {trainings?.map((training) => (
                      <TrainingItem
                        key={training.id}
                        training={training}
                        programId={programId}
                        type={type}
                        refreshList={refreshList}
                        handleSuccessCreate={handleSuccessCreate}
                      />
                    ))}
                  </>
                )}
              </Stack>
            </Box>
          </>
        )}
        {create.value && (
          <CreateTraining
            open={create.value}
            programId={programId}
            type={type}
            onClose={handleCloseCreate}
            handleSuccessCreate={handleSuccessCreate}
          />
        )}
      </Box>
    </DialogProvider>
  );
}
