import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import useMedia from 'src/hooks/use-media';
import { removeItems } from 'src/utils/medias';

import TransferList from './transfer-list';

const defaultFilters = {
  title: '',
};

export default function SelectMedia({
  open,
  onClose,
  onSelectMedias,
  mediasSelected,
  isStretches,
  ...other
}) {
  const { onGetListMedias, medias } = useMedia();

  const [left, setLeft] = useState([]);

  const [right, setRight] = useState([]);

  const [mediasFiltered, setMediasFiltered] = useState([]);

  const [newMedias, setNewMedias] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);
  const dataFiltered = applyFilter({
    inputData: mediasFiltered,
    filters,
  });

  const initialize = useCallback(async () => {
    try {
      onGetListMedias(isStretches);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (medias) {
      if (!isStretches) {
        const filtered = medias?.filter((item) => !item.tags.includes('Alongamentos'));
        setNewMedias(filtered);
      } else {
        setNewMedias(medias);
      }
    }
  }, [medias]);

  useEffect(() => {
    if (newMedias) {
      const mediasID = mediasSelected.map((item) => item.id);
      const selected = newMedias.filter((item) => mediasID.includes(item.id));
      const removed = removeItems(newMedias, mediasID);
      setLeft(selected);
      setMediasFiltered(removed);
    }
  }, [newMedias]);

  return (
    <Dialog open={open} {...other} maxWidth={'lg'}>
      <DialogTitle>
        <Stack alignItems="center" direction="column">
          <Stack alignItems="center">
            <Typography>Selecione os videos para esse treino</Typography>
          </Stack>
        </Stack>
      </DialogTitle>
      {newMedias && (
        <TransferList
          medias={mediasFiltered}
          left={left}
          setLeft={setLeft}
          right={right}
          setRight={setRight}
          dataFiltered={dataFiltered}
          setFilters={setFilters}
        />
      )}

      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" color="success" onClick={() => onSelectMedias(left)}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function applyFilter({ inputData, filters }) {
  const { title } = filters;

  if (title) {
    inputData = inputData.filter(
      (program) => program.title.toLowerCase().indexOf(title.toLowerCase()) !== -1,
    );
  }
  return inputData;
}
