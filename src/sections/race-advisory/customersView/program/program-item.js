import { Stack } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import useProgram from 'src/hooks/use-program';

import {
  ActionsHeader,
  Advanced,
  BasecInfoColumn1,
  BasecInfoColumn2,
  BasecInfoSubTitle,
  BasecInfoTitle,
  BaseHeader,
  Beginner,
  CheckboxAction,
  Container,
  ListItem,
} from './styles';

export default function ProgramItem({ onSelectedProgram }) {
  const { programs } = useProgram();
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
          <Stack key={program.id} onClick={() => onSelectedProgram(program.id)}>
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
