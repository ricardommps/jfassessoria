import Checkbox from '@mui/material/Checkbox';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import {
  BasecInfo,
  BasecInfoSubTitle,
  BasecInfoTitle,
  CheckboxAction,
  Liberated,
  ListItem,
  NoShow,
  PublishedDate,
} from './styles';
export default function TrainingItem({
  training,
  onSelectedTraining,
  onSelectRow,
  trainingsSelected,
}) {
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

  return (
    <>
      <ListItem onClick={() => onSelectedTraining(training)}>
        <CheckboxAction>
          <Checkbox
            checked={trainingsSelected.includes(training.id)}
            onClick={(event) => onSelectRow(training.id, event)}
          />
        </CheckboxAction>
        <img
          onError={addDefaultSrc}
          src={training?.cover_url || 'https://supertreinosapp.com/img/TREINO-BANNER-PADRAO.jpg'}
        />
        <BasecInfo>
          <BasecInfoTitle>{training.name}</BasecInfoTitle>
          <BasecInfoSubTitle>{training.description}</BasecInfoSubTitle>
          <BasecInfoSubTitle>
            {format(new Date(training.datePublished), 'dd MMM yyyy')}
          </BasecInfoSubTitle>
        </BasecInfo>
      </ListItem>
      <PublishedDate>{renderPublished(training.published)}</PublishedDate>
    </>
  );
}

TrainingItem.propTypes = {
  training: PropTypes.object,
  onSelectedTraining: PropTypes.func,
  onSelectRow: PropTypes.func,
  trainingsSelected: PropTypes.array,
};
