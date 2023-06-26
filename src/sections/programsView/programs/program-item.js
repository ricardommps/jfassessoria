import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify/iconify';
import { difficultyLevel } from 'src/utils/difficultyLevel';

import ImagePlaceHolder from '../components/image-placeholder';
import {
  ActionButton,
  Actions,
  ButtonLabel,
  Card,
  CardDetails,
  CardImage,
  Container,
  Difficulty,
  Goal,
  Name,
  Weeks,
  Wrapper,
} from './styles';

export default function ProgramItem({
  program,
  openClone,
  setCurrentProgramEdit,
  currentCustomer,
}) {
  const theme = useTheme();
  const { name, cover_path, difficulty_level, goals, weeks } = program;

  const handleEditProgram = () => {
    setCurrentProgramEdit(program);
  };

  const getValueAccountProgram = () => {
    return (
      program.students.filter((student) => student.customer_id === currentCustomer.id).length > 0
    );
  };

  return (
    <Container>
      <Card>
        <CardImage src={cover_path} alt="Live from space album cover" width={150} height={200} />
        {!currentCustomer && <ImagePlaceHolder handleEditProgram={handleEditProgram} />}

        <div>
          <CardDetails>
            <Name>
              <span>{name}</span>
            </Name>
            <Difficulty>
              <Stack
                direction="row"
                alignItems="center"
                sx={{ color: theme.palette.level[difficultyLevel(difficulty_level)] }}
              >
                <Iconify icon="eva:flash-outline" width={16} sx={{ mr: 0.5 }} />
                <span>{difficulty_level}</span>
              </Stack>
            </Difficulty>
            <Goal>
              <Stack direction="row" alignItems="center" sx={{ color: 'text.disabled' }}>
                <Iconify
                  icon="eva:message-circle-fill"
                  width={16}
                  sx={{
                    mr: 0.5,
                  }}
                />
                <span>{goals[0].name}</span>
              </Stack>
            </Goal>
            <Weeks>
              <Stack direction="row" alignItems="center" sx={{ color: 'text.disabled' }}>
                <Iconify
                  icon="eva:calendar-outline"
                  width={16}
                  sx={{
                    mr: 0.5,
                  }}
                />
                <span>Semanas: {weeks ? weeks : 'N/D'}</span>
              </Stack>
            </Weeks>
            {currentCustomer && (
              <FormControlLabel
                control={<Switch checked={getValueAccountProgram()} />}
                label="Selecionado"
                sx={{ ml: 1, mt: 1 }}
              />
            )}
          </CardDetails>
          {!currentCustomer && (
            <Actions>
              <>
                <ActionButton>
                  <Wrapper>
                    <Iconify icon="eva:trash-2-outline" width={20} sx={{ color: '#888' }} />
                    <ButtonLabel>Apagar</ButtonLabel>
                  </Wrapper>
                </ActionButton>
                <ActionButton>
                  <Wrapper>
                    <Iconify icon="eva:copy-outline" width={20} sx={{ color: '#888' }} />
                    <ButtonLabel>Clonar</ButtonLabel>
                  </Wrapper>
                </ActionButton>
                <ActionButton onClick={() => openClone(program)}>
                  <Wrapper>
                    <Iconify icon="eva:navigation-2-outline" width={20} sx={{ color: '#888' }} />
                    <ButtonLabel>Enviar</ButtonLabel>
                  </Wrapper>
                </ActionButton>
              </>
            </Actions>
          )}
        </div>
      </Card>
    </Container>
  );
}

ProgramItem.propTypes = {
  program: PropTypes.object,
  openClone: PropTypes.func,
  setCurrentProgramEdit: PropTypes.func,
  currentCustomer: PropTypes.object,
};
