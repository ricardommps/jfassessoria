import { Stack } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getModuleName } from 'src/utils/training-modules';

import { BasecInfoColumn1, BasecInfoSubTitle, BasecInfoTitle, ListItem } from './styles';
export default function TrainingItem({ item, handleSelectedTraining }) {
  return (
    <Stack>
      <ListItem onClick={() => handleSelectedTraining(item.finishedid)}>
        <BasecInfoColumn1>
          <Stack direction="row">
            <BasecInfoTitle>{getModuleName(item.trainingname)} </BasecInfoTitle>
          </Stack>
          <BasecInfoSubTitle>{item.tariningdesc}</BasecInfoSubTitle>
          <BasecInfoSubTitle bold>
            {' '}
            {item.trainingpublished &&
              format(new Date(item.trainingpublished), 'dd/MM/yyyy', { locale: ptBR })}
            {item.training_date_other && (
              <>
                {' ou '}
                {item.training_date_other &&
                  format(new Date(item.training_date_other), 'dd/MM/yyyy', { locale: ptBR })}
              </>
            )}
          </BasecInfoSubTitle>
        </BasecInfoColumn1>
      </ListItem>
    </Stack>
  );
}
