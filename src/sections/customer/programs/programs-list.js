import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useCallback, useEffect, useState } from 'react';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify/iconify';
import LoadingProgress from 'src/components/loading-progress';
import { useBoolean } from 'src/hooks/use-boolean';
import useProgram from 'src/hooks/use-program';

import Training from '../training/training';
import CreateProgram from './create-program';
import EditProgram from './edit-program';
import ProgramItem from './program-item';

export const NEW_OPTIONS = [
  {
    value: 1,
    label: 'Programa de corrida',
  },
  {
    value: 2,
    label: 'Programa de força',
  },
];

export default function ProgramsList({ id }) {
  const { onListProgramsV2, programs, programsStatus } = useProgram();

  const [loading, setLoading] = useState(false);
  const [programSelected, setProgramSelected] = useState();
  const [typeAction, setTypeAction] = useState();
  const [typeProgram, setTypeProgram] = useState(null);

  const popover = usePopover();
  const editProgram = useBoolean();
  const training = useBoolean();
  const createProgram = useBoolean();

  const handleOpenEditProgram = (program) => {
    training.onFalse();
    createProgram.onFalse();
    setTypeAction('program');
    setProgramSelected(program);
  };

  const handleOpenCreateProgram = (value) => {
    training.onFalse();
    createProgram.onFalse();
    setTypeProgram(value);
  };

  const handleCloseCreateProgram = () => {
    setTypeProgram(null);
    setProgramSelected();
  };

  const handleSuccessCreateProgram = () => {
    editProgram.onFalse();
    setTypeProgram(null);
    setProgramSelected();
    initialize();
  };

  const handleOpenTraining = (program) => {
    editProgram.onFalse();
    setTypeAction('training');
    setProgramSelected(program);
  };

  const handleCloseEditProgram = () => {
    setProgramSelected();
    setTypeAction(null);
    editProgram.onFalse();
    training.onFalse();
  };

  const handleCloseTraining = () => {
    setProgramSelected();
    editProgram.onFalse();
    training.onFalse();
    setTypeAction(null);
  };

  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      await onListProgramsV2(id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refreshList = () => {
    initialize();
  };

  useEffect(() => {
    if (id) {
      initialize();
    }
  }, [id, initialize]);

  useEffect(() => {
    if (programSelected) {
      if (typeAction === 'program') {
        editProgram.onTrue();
      }

      if (typeAction === 'training') {
        training.onTrue();
      }
    }
  }, [programSelected, typeAction]);
  return (
    <Grid container spacing={2}>
      <Grid xs={12} md={4}>
        <Stack direction="row" pb={2}>
          <Typography variant="h3" sx={{ flex: 1 }}>
            Programas
          </Typography>
          <Button
            size="medium"
            color="inherit"
            variant="contained"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            sx={{ textTransform: 'capitalize' }}
            onClick={popover.onOpen}
          >
            Novo
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
                disabled={programs?.some((program) => program.type === option.value)}
                onClick={() => {
                  popover.onClose();
                  handleOpenCreateProgram(option.value);
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </CustomPopover>
        </Stack>

        {(programsStatus.loading || loading) && <LoadingProgress />}
        <Stack spacing={2}>
          {(!programsStatus.loading || !loading) && programsStatus.empty && (
            <EmptyContent
              imgUrl="/assets/icons/empty/ic_content.svg"
              sx={{
                borderRadius: 1.5,
                bgcolor: 'background.default',
                height: '50vh',
              }}
            />
          )}
          {(!programsStatus.loading || !loading) && !programsStatus.empty && programs && (
            <>
              {programs?.map((program) => (
                <ProgramItem
                  program={program}
                  key={program.id}
                  handleOpenEditProgram={handleOpenEditProgram}
                  handleOpenTraining={handleOpenTraining}
                  idSelected={programSelected?.id}
                  refreshList={refreshList}
                />
              ))}
            </>
          )}
        </Stack>
      </Grid>
      <Grid xs={12} md={8} px={20}>
        {editProgram.value && (
          <EditProgram
            open={editProgram.value}
            id={programSelected?.id}
            handleCloseEditProgram={handleCloseEditProgram}
            handleSuccessCreateProgram={handleSuccessCreateProgram}
          />
        )}

        {typeProgram && (
          <CreateProgram
            open={Boolean(typeProgram)}
            id={programSelected?.id}
            handleCloseEditProgram={handleCloseCreateProgram}
            programType={typeProgram}
            handleSuccessCreateProgram={handleSuccessCreateProgram}
          />
        )}

        {training.value && (
          <Training
            open={training.value}
            id={programSelected?.id}
            handleCloseTraining={handleCloseTraining}
            type={programSelected?.type}
          />
        )}
      </Grid>
    </Grid>
  );
}
