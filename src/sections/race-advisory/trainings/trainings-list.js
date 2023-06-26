import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import NearMeIcon from '@mui/icons-material/NearMe';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { runnerTrainingsData } from 'src/_mock';
import { ButtonIcon } from 'src/components/button-icon/button-icon';
import { DialogInfo } from 'src/components/dialog-info/dialog-info';

import { CloneExport } from './clone-export/clone-export';
import { DialogSelectDate } from './dialog-select-date/dialog-select-date';
import { ActionsHeader, Container } from './styles';
import TrainingItem from './training-item';
export default function TrainingsList({ onSelectedTraining }) {
  const { trainings } = runnerTrainingsData;

  const [trainingsSelected, setTrainingsSelected] = useState([]);
  const [openInfo, setOpenInfo] = useState(false);
  const [infoProps, setInfoProps] = useState(null);
  const [openSelectDate, setOpenSelectDate] = useState(false);

  const handleSetInfoHideTrainings = () => {
    setOpenInfo(true);
    setInfoProps({
      title: 'Ocultar Treino',
      msg: 'Os treinos selecionados serão ocultados para o aluno. Deseja prosseguir?',
    });
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
    setInfoProps(null);
  };

  const handleClickOpenSelectDate = () => {
    setOpenSelectDate(true);
  };
  const handleCloseSelectDate = () => {
    setOpenSelectDate(false);
  };

  const onSelectRow = useCallback(
    (inputValue, e) => {
      e.stopPropagation();
      const newSelected = trainingsSelected.includes(inputValue)
        ? trainingsSelected.filter((value) => value !== inputValue)
        : [...trainingsSelected, inputValue];

      setTrainingsSelected(newSelected);
    },
    [trainingsSelected],
  );

  const onSelectAllRows = useCallback((checked, inputValue) => {
    if (checked) {
      setTrainingsSelected(inputValue);
      return;
    }
    setTrainingsSelected([]);
  }, []);

  const handleSelectAllTrainings = (checked) => {
    onSelectAllRows(
      checked,
      trainings.map((item) => item.id),
    );
  };

  const handleSetInfoPublishTrainings = () => {
    setOpenInfo(true);
    setInfoProps({
      title: 'Publicar Programa',
      msg: 'Os programas selecionados estarão disponíveis para o aluno. Deseja prosseguir?',
    });
  };

  return (
    <Container>
      <ActionsHeader>
        <InputAdornment position="end" sx={{ mr: 1, mb: 3 }}>
          <Checkbox
            onChange={(event) => handleSelectAllTrainings(event.target.checked)}
            checked={!!trainings.length && trainingsSelected.length === trainings.length}
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
          <ButtonIcon onClick={handleSetInfoHideTrainings}>
            <Tooltip title="Ocultar selecionados" placement="top">
              <VisibilityOffIcon sx={{ fontSize: '28px', width: '28px', height: '30px' }} />
            </Tooltip>
          </ButtonIcon>
          <ButtonIcon onClick={handleSetInfoPublishTrainings}>
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
          <ButtonIcon onClick={handleClickOpenSelectDate}>
            <Tooltip
              title="Agendar liberação"
              placement="top"
              sx={{ WebkitFlexGrow: '1', textAlign: 'start' }}
            >
              <AlarmOnIcon sx={{ fontSize: '28px', width: '28px', height: '30px' }} />
            </Tooltip>
          </ButtonIcon>
        </InputAdornment>
        <hr />
      </ActionsHeader>
      {trainings.map((training) => (
        <div key={training.id}>
          <TrainingItem
            training={training}
            onSelectedTraining={onSelectedTraining}
            onSelectRow={onSelectRow}
            trainingsSelected={trainingsSelected}
          />
        </div>
      ))}
      <DialogInfo
        title={infoProps?.title}
        msg={infoProps?.msg}
        open={openInfo}
        handleClose={handleCloseInfo}
      />
      <DialogSelectDate open={openSelectDate} handleClose={handleCloseSelectDate} />
    </Container>
  );
}

TrainingsList.propTypes = {
  onSelectedTraining: PropTypes.func,
};
