import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import NearMeIcon from '@mui/icons-material/NearMe';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import format from 'date-fns/format';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { runnerProgramsData } from 'src/_mock';
import { ButtonIcon } from 'src/components/button-icon/button-icon';
import { DialogInfo } from 'src/components/dialog-info/dialog-info';

import { CloneExport } from './clone-export/clone-export';
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
export default function ProgramItem({ onOpenTrainings }) {
  const { programs } = runnerProgramsData;

  const [openInfo, setOpenInfo] = useState(false);
  const [infoProps, setInfoProps] = useState(null);
  const [programsSelected, setProgramsSelected] = useState([]);

  const renderRefereceMonth = (refereceMonth) => {
    if (refereceMonth) {
      return format(new Date(refereceMonth), 'MMMM-yyyy');
    }

    return '';
  };

  const handleSetInfoHidePrograns = () => {
    setOpenInfo(true);
    setInfoProps({
      title: 'Ocultar Programa',
      msg: 'Os programas selecionados serão ocultados para os alunos. Deseja prosseguir?',
    });
  };

  const handleSetInfoPublishPrograns = () => {
    setOpenInfo(true);
    setInfoProps({
      title: 'Publicar Programa',
      msg: 'Os programas selecionados estarão disponíveis para os alunos. Deseja prosseguir?',
    });
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
    setInfoProps(null);
  };

  const onSelectRow = useCallback(
    (inputValue, e) => {
      e.stopPropagation();
      const newSelected = programsSelected.includes(inputValue)
        ? programsSelected.filter((value) => value !== inputValue)
        : [...programsSelected, inputValue];

      setProgramsSelected(newSelected);
    },
    [programsSelected],
  );

  const onSelectAllRows = useCallback((checked, inputValue) => {
    if (checked) {
      setProgramsSelected(inputValue);
      return;
    }
    setProgramsSelected([]);
  }, []);

  const handleSelectAllPrograms = (checked) => {
    onSelectAllRows(
      checked,
      programs.map((item) => item.id),
    );
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
    <Container>
      <ActionsHeader>
        <InputAdornment position="end" sx={{ mr: 1, mb: 3 }}>
          <Checkbox
            onChange={(event) => handleSelectAllPrograms(event.target.checked)}
            checked={!!programs.length && programsSelected.length === programs.length}
          />
          <ButtonIcon disabled>
            <Tooltip title="Apagar treino" placement="top">
              <DeleteIcon sx={{ fontSize: '28px', width: '28px', height: '30px' }} />
            </Tooltip>
          </ButtonIcon>
          <ButtonIcon>
            <Tooltip title="Clonar treino" placement="top">
              <ContentCopyIcon sx={{ fontSize: '28px', width: '28px', height: '30px' }} />
            </Tooltip>
          </ButtonIcon>
          <ButtonIcon onClick={handleSetInfoHidePrograns}>
            <Tooltip title="Ocultar selecionados" placement="top">
              <VisibilityOffIcon sx={{ fontSize: '28px', width: '28px', height: '30px' }} />
            </Tooltip>
          </ButtonIcon>

          <ButtonIcon onClick={handleSetInfoPublishPrograns}>
            <Tooltip title="Exibir selecionados" placement="top">
              <VisibilityIcon sx={{ fontSize: '28px', width: '28px', height: '30px' }} />
            </Tooltip>
          </ButtonIcon>
          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <>
                <ButtonIcon {...bindTrigger(popupState)}>
                  <Tooltip title="Exportar clone" placement="top">
                    <NearMeIcon sx={{ fontSize: '28px', width: '28px', height: '30px' }} />
                  </Tooltip>
                </ButtonIcon>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <CloneExport />
                </Popover>
              </>
            )}
          </PopupState>
        </InputAdornment>
        <hr />
      </ActionsHeader>
      {programs.map((program) => (
        <div key={program.id} onClick={() => onOpenTrainings(program)}>
          <ListItem>
            <CheckboxAction>
              <Checkbox
                checked={programsSelected.includes(program.id)}
                onClick={(event) => onSelectRow(program.id, event)}
              />
            </CheckboxAction>
            <BasecInfoColumn1>
              <BasecInfoTitle>{program.name}</BasecInfoTitle>
              <BasecInfoSubTitle>{program.goal}</BasecInfoSubTitle>
              <BasecInfoSubTitle>{renderRefereceMonth(program.refereceMonth)}</BasecInfoSubTitle>
            </BasecInfoColumn1>
            <BasecInfoColumn2>
              <BasecInfoTitle>PV: {program.pv}</BasecInfoTitle>
              <BasecInfoSubTitle>Pace: {program.pace} </BasecInfoSubTitle>
            </BasecInfoColumn2>
          </ListItem>
          <BaseHeader>{renderDifficultyLevel(program.difficulty_level)}</BaseHeader>
        </div>
      ))}
      <DialogInfo
        title={infoProps?.title}
        msg={infoProps?.msg}
        open={openInfo}
        handleClose={handleCloseInfo}
      />
    </Container>
  );
}

ProgramItem.propTypes = {
  onOpenTrainings: PropTypes.func,
};
