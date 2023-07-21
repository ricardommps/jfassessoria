import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { ButtonIcon } from 'src/components/button-icon/button-icon';
import useProgram from 'src/hooks/use-program';

import {
  Advanced,
  BasecColumnAction,
  BasecInfoColumn1,
  BasecInfoColumn2,
  BasecInfoSubTitle,
  BasecInfoTitle,
  BaseHeader,
  Beginner,
  CheckboxAction,
  ListItem,
} from './styles';

export default function ProgramItem({ onSelectedProgram, onCloneProgram, cloneProgramStatus }) {
  const { programs } = useProgram();

  const handleCopyProgram = useCallback((program, e) => {
    e.stopPropagation();
    const payload = Object.assign({}, program);
    delete payload.id;
    payload.name = `[COPY]${payload.name}`;
    const newTrainings = payload.trainings.map((obj) => {
      const newTraining = { ...obj, name: `[COPY]${obj.name}` };
      delete newTraining.id;
      return { ...newTraining };
    });
    payload.trainings = [...newTrainings];
    onCloneProgram(payload);
  }, []);

  const renderreferenceMonth = (referenceMonth) => {
    if (referenceMonth) {
      return format(new Date(referenceMonth), 'MMMM-yyyy');
    }

    return '';
  };
  const renderDifficultyLevel = (difficylty) => {
    if (difficylty === 'Avançado') {
      return (
        <span>
          <Advanced>{difficylty}</Advanced>
        </span>
      );
    } else {
      return (
        <span>
          <Beginner>{difficylty}</Beginner>
        </span>
      );
    }
  };

  return (
    <>
      {programs &&
        programs.map((program) => (
          <Stack
            key={program.id}
            onClick={() => {
              cloneProgramStatus.loading ? null : onSelectedProgram(program.id);
            }}
          >
            <ListItem>
              <CheckboxAction>
                {cloneProgramStatus.loading ? (
                  <Stack pt={2}>
                    <Skeleton variant="rectangular" width={20} height={20} />
                  </Stack>
                ) : (
                  <Checkbox />
                )}
              </CheckboxAction>

              <BasecInfoColumn1>
                <BasecInfoTitle>
                  {cloneProgramStatus.loading ? <Skeleton variant="text" /> : <>{program.name}</>}
                </BasecInfoTitle>
                <BasecInfoSubTitle>
                  {cloneProgramStatus.loading ? <Skeleton variant="text" /> : <>{program.goal}</>}
                </BasecInfoSubTitle>
                <BasecInfoSubTitle>
                  {cloneProgramStatus.loading ? (
                    <Skeleton variant="text" />
                  ) : (
                    <>{renderreferenceMonth(program.referenceMonth)}</>
                  )}
                </BasecInfoSubTitle>
              </BasecInfoColumn1>
              <BasecInfoColumn2>
                <BasecInfoTitle>
                  {cloneProgramStatus.loading ? <Skeleton variant="text" /> : <>PV: {program.pv}</>}
                </BasecInfoTitle>
                <BasecInfoSubTitle>
                  {cloneProgramStatus.loading ? (
                    <Skeleton variant="text" />
                  ) : (
                    <>Pace: {program.pace}</>
                  )}
                </BasecInfoSubTitle>
              </BasecInfoColumn2>
              <BasecColumnAction>
                <InputAdornment position="end" sx={{ mr: 1 }}>
                  <ButtonIcon
                    onClick={(event) =>
                      cloneProgramStatus.loading ? null : handleCopyProgram(program, event)
                    }
                  >
                    <Tooltip title="Clonar treino" placement="top">
                      {cloneProgramStatus.loading ? (
                        <Stack pt={2}>
                          <Skeleton variant="rectangular" width={20} height={20} />
                        </Stack>
                      ) : (
                        <ContentCopyIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
                      )}
                    </Tooltip>
                  </ButtonIcon>
                </InputAdornment>
              </BasecColumnAction>
            </ListItem>
            {program.difficultyLevel && (
              <BaseHeader>
                {cloneProgramStatus.loading ? (
                  <Skeleton variant="text" />
                ) : (
                  <> {renderDifficultyLevel(program.difficultyLevel)}</>
                )}
              </BaseHeader>
            )}
            <Stack sx={{ p: 1 }} />
          </Stack>
        ))}
    </>
  );
}

ProgramItem.propTypes = {
  onSelectedProgram: PropTypes.func,
};
