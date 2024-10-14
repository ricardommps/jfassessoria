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
  tags: [],
};

export default function SelectMedia({
  open,
  onClose,
  onSelectMedias,
  mediasSelected,
  isStretches,
  mediaOrder,
  tags,
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
    tags: tags,
  });

  const initialize = useCallback(async () => {
    try {
      onGetListMedias(isStretches);
    } catch (error) {
      console.error(error);
    }
  }, [isStretches, onGetListMedias]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (medias) {
      if (!isStretches) {
        const filtered = medias?.filter(
          (item) => !item.tags.includes('Alongamento ativo', 'Alongamento passivo', 'Alongamentos'),
        );
        setNewMedias(filtered);
      } else {
        setNewMedias(medias);
      }
    }
  }, [medias, isStretches]);

  useEffect(() => {
    if (newMedias) {
      const mediasID = mediasSelected.map((item) => item.id);
      const selected = newMedias.filter((item) => mediasID.includes(item.id));
      const removed = removeItems(newMedias, mediasID);

      // Ordenar o left com base no mediaOrder
      const orderedLeft = selected.sort(
        (a, b) => mediaOrder.indexOf(a.id) - mediaOrder.indexOf(b.id),
      );

      setLeft(orderedLeft);
      setMediasFiltered(removed);
    }
  }, [newMedias, mediasSelected, mediaOrder]);

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
          medias={dataFiltered}
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

function applyFilter({ inputData, filters, tags }) {
  const { title } = filters;

  if (title) {
    inputData = inputData.filter(
      (program) => program.title.toLowerCase().indexOf(title.toLowerCase()) !== -1,
    );
  }

  if (tags?.length) {
    inputData = inputData.filter((media) => tags.some((tag) => media.tags.includes(tag)));
  }
  return inputData;
}
