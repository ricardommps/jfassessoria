import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Stack } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import { useState } from 'react';
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

export default function ProgramItem({ onSelectedProgram }) {
  const { programs } = useProgram();
  const [programsSelected, setProgramsSelected] = useState([]);

  const handleCopyProgram = (program) => {
    setProgramsSelected(program);
  };
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
              onSelectedProgram(program.id);
            }}
          >
            <ListItem>
              <CheckboxAction>
                <Checkbox />
              </CheckboxAction>
              <BasecInfoColumn1>
                <BasecInfoTitle>{program.name}</BasecInfoTitle>
                <BasecInfoSubTitle>{program.goal}</BasecInfoSubTitle>
                <BasecInfoSubTitle>
                  {renderreferenceMonth(program.referenceMonth)}
                </BasecInfoSubTitle>
              </BasecInfoColumn1>
              <BasecInfoColumn2>
                <BasecInfoTitle>PV: {program.pv}</BasecInfoTitle>
                <BasecInfoSubTitle>Pace: {program.pace} </BasecInfoSubTitle>
              </BasecInfoColumn2>
              {false && (
                <BasecColumnAction>
                  <InputAdornment position="end" sx={{ mr: 1 }}>
                    <ButtonIcon onClick={() => handleCopyProgram(program)}>
                      <Tooltip title="Clonar treino" placement="top">
                        <ContentCopyIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
                      </Tooltip>
                    </ButtonIcon>
                  </InputAdornment>
                </BasecColumnAction>
              )}
            </ListItem>
            {program.difficultyLevel && (
              <BaseHeader>{renderDifficultyLevel(program.difficultyLevel)}</BaseHeader>
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
