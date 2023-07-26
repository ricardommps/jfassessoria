import { Stack } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { format } from 'date-fns';
import useTraining from 'src/hooks/use-training';

import {
  BasecInfoColumn1,
  BasecInfoSubTitle,
  BasecInfoTitle,
  CheckboxAction,
  ListItem,
} from './styles';

export default function TrainingItem() {
  const { trainings, onTrainingById } = useTraining();
  const addDefaultSrc = (ev) => {
    ev.target.src = 'https://supertreinosapp.com/img/TREINO-BANNER-PADRAO.jpg';
  };
  return (
    <>
      {trainings &&
        trainings.map((training) => (
          <Stack key={training.id} onClick={() => onTrainingById(training.id)}>
            <ListItem>
              <CheckboxAction>
                <Checkbox />
              </CheckboxAction>
              <img
                onError={addDefaultSrc}
                src={
                  training?.cover_url || 'https://supertreinosapp.com/img/TREINO-BANNER-PADRAO.jpg'
                }
              />
              <BasecInfoColumn1>
                <BasecInfoTitle>{training.name}</BasecInfoTitle>
                <BasecInfoSubTitle>{training.description}</BasecInfoSubTitle>
                <BasecInfoSubTitle>
                  {' '}
                  {training.datePublished &&
                    format(new Date(training.datePublished), 'dd MMM yyyy')}
                </BasecInfoSubTitle>
              </BasecInfoColumn1>
            </ListItem>

            <Stack sx={{ p: 1 }} />
          </Stack>
        ))}
    </>
  );
}
