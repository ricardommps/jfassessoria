import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getModuleName } from 'src/utils/training-modules';

import { BasecInfoColumn1, BasecInfoSubTitle, BasecInfoTitle, ListItem } from './styles';
export default function TrainingItem({ item, handleSelectedTraining }) {
  const renderUnrealized = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        right: 8,
        zIndex: 9,
        borderRadius: 1,
        position: 'absolute',
        p: '2px 6px 2px 4px',
        typography: 'subtitle2',
        bgcolor: 'error.main',
      }}
    >
      <Box component="span" sx={{ mr: 0.25, fontSize: '11px' }}>
        Não realizado
      </Box>
    </Stack>
  );
  return (
    <Stack>
      <ListItem onClick={() => handleSelectedTraining(item.finishedid)}>
        {item?.unrealized && <>{renderUnrealized}</>}
        <Stack>
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
        </Stack>
      </ListItem>
    </Stack>
  );
}
