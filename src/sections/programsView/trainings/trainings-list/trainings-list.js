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
import { trainingsData } from 'src/_mock';
import { ButtonIcon } from 'src/components/button-icon/button-icon';

import { CloneExport } from '../clone-export/clone-export';
import { DialogHideTraining } from '../dialog-hide-training/dialog- hide-training';
import { DialogPublishTraining } from '../dialog-publish-training/dialog-publish-training';
import { DialogSelectDate } from '../dialog-select-date/dialog-select-date';
import {
  ActionsHeader,
  BasecInfo,
  BasecInfoSubTitle,
  BasecInfoTitle,
  CheckboxAction,
  Container,
  Liberated,
  ListItem,
  NoShow,
  PublishedDate,
  SeletedTrainingsCounter,
} from './styles';

export function TrainingsList({ setCurrentTrainingEdit }) {
  const [openSelectDate, setOpenSelectDate] = useState(false);
  const [openPublishTrainings, setOpenPublishTrainings] = useState(false);
  const [openHideTrainings, setOpenHideTrainings] = useState(false);

  const handleClickOpenSelectDate = () => {
    setOpenSelectDate(true);
  };
  const handleCloseSelectDate = () => {
    setOpenSelectDate(false);
  };

  const handleClickOpenPublishTrainings = () => {
    setOpenPublishTrainings(true);
  };
  const handleClosePublishTrainings = () => {
    setOpenPublishTrainings(false);
  };

  const handleClickOpenHideTrainings = () => {
    setOpenHideTrainings(true);
  };
  const handleCloseHideTrainings = () => {
    setOpenHideTrainings(false);
  };

  const { trainings } = trainingsData;
  const [trainingsSelected, setTrainingsSelected] = useState([]);
  const addDefaultSrc = (ev) => {
    ev.target.src = 'https://supertreinosapp.com/img/TREINO-BANNER-PADRAO.jpg';
  };

  const renderPublished = (published) => {
    if (published) {
      return (
        <span>
          <Liberated>Liberado</Liberated>
        </span>
      );
    } else {
      return (
        <span>
          <NoShow>Oculto</NoShow>
        </span>
      );
    }
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

  const handleEditTraining = (training) => {
    setCurrentTrainingEdit(training);
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

          <ButtonIcon onClick={handleClickOpenHideTrainings}>
            <Tooltip title="Ocultar selecionados" placement="top">
              <VisibilityOffIcon sx={{ fontSize: '28px', width: '28px', height: '30px' }} />
            </Tooltip>
          </ButtonIcon>

          <ButtonIcon onClick={handleClickOpenPublishTrainings}>
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

          <SeletedTrainingsCounter>{`${trainingsSelected.length}/${trainings.length}`}</SeletedTrainingsCounter>
        </InputAdornment>
        <hr />
      </ActionsHeader>
      {trainings.map((training) => (
        <div key={training.id}>
          <ListItem onClick={() => handleEditTraining(training)}>
            <CheckboxAction>
              <Checkbox
                checked={trainingsSelected.includes(training.id)}
                onClick={(event) => onSelectRow(training.id, event)}
              />
            </CheckboxAction>
            <img onError={addDefaultSrc} src={training.cover_url} />
            <BasecInfo>
              <BasecInfoTitle>{training.name}</BasecInfoTitle>
              <BasecInfoSubTitle>{training.subtitle}</BasecInfoSubTitle>
            </BasecInfo>
          </ListItem>
          <PublishedDate>{renderPublished(training.published)}</PublishedDate>
        </div>
      ))}
      <DialogSelectDate open={openSelectDate} handleClose={handleCloseSelectDate} />
      <DialogPublishTraining
        open={openPublishTrainings}
        handleClose={handleClosePublishTrainings}
      />
      <DialogHideTraining open={openHideTrainings} handleClose={handleCloseHideTrainings} />
    </Container>
  );
}

TrainingsList.propTypes = {
  setCurrentTrainingEdit: PropTypes.func,
};
