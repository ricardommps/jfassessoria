import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useMedia from 'src/hooks/use-media';
import { removeItems } from 'src/utils/medias';
import { _tags } from 'src/utils/tags';

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
  mediaOrder,
  tags,
  excludedTags,
  includedTags,
  ...other
}) {
  const { onGetListMedias, medias } = useMedia();

  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [mediasFiltered, setMediasFiltered] = useState([]);
  const [newMedias, setNewMedias] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  // Aplica os filtros definidos ao `mediasFiltered`
  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: mediasFiltered,
        filters,
        tags: tags,
      }),
    [mediasFiltered, filters, tags],
  );

  // Função para inicializar e buscar mídias com base nas tags
  const initialize = useCallback(async () => {
    try {
      if (tags?.length > 0) {
        await onGetListMedias(tags);
        return;
      }
      if (excludedTags) {
        const filteredTags = _tags.filter((tag) => !excludedTags.includes(tag));
        await onGetListMedias(filteredTags);
      } else if (includedTags) {
        await onGetListMedias(includedTags);
      } else {
        await onGetListMedias();
      }
    } catch (error) {
      console.error(error);
    }
  }, [includedTags, onGetListMedias, tags, excludedTags]);

  // Chama a função `initialize` ao montar o componente
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Aplica filtros ao `medias` baseado em `excludedTags` e `includedTags`
  useEffect(() => {
    if (medias) {
      let filtered;
      if (excludedTags) {
        filtered = medias.filter((item) => !item.tags.some((tag) => excludedTags.includes(tag)));
      } else if (includedTags) {
        filtered = medias.filter((item) => item.tags.some((tag) => includedTags.includes(tag)));
      } else {
        filtered = medias;
      }
      setNewMedias(filtered);
    }
  }, [medias, excludedTags, includedTags]);

  // Inicializa `left` e `mediasFiltered` com base em `newMedias` e `mediasSelected`
  useEffect(() => {
    if (newMedias) {
      const mediasID = mediasSelected.map((item) => item.id);
      const selected = newMedias.filter((item) => mediasID.includes(item.id));
      const removed = removeItems(newMedias, mediasID);

      const orderedLeft = selected.sort(
        (a, b) => mediaOrder.indexOf(a.id) - mediaOrder.indexOf(b.id),
      );

      setLeft(orderedLeft);
      setMediasFiltered(removed);
    }
  }, [newMedias, mediasSelected, mediaOrder]);

  // Atualiza `right` com `dataFiltered` antes de renderizar `TransferList`
  useEffect(() => {
    setRight(dataFiltered);
  }, [dataFiltered]);

  return (
    <Dialog open={open} {...other} maxWidth={'lg'}>
      <DialogTitle>
        <Stack alignItems="center" direction="column">
          <Typography>Selecione os vídeos para esse treino</Typography>
        </Stack>
      </DialogTitle>
      {newMedias && (
        <TransferList
          medias={right} // Utiliza `right` já com `dataFiltered`
          left={left}
          setLeft={setLeft}
          right={right}
          setRight={setRight}
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

// Função para aplicação de filtros com checagem de tags e título
function applyFilter({ inputData, filters, tags }) {
  const { title } = filters;

  if (title) {
    inputData = inputData.filter((media) =>
      media.title.toLowerCase().includes(title.toLowerCase()),
    );
  }

  if (tags?.length) {
    inputData = inputData.filter((media) => tags.some((tag) => media.tags.includes(tag)));
  }
  return inputData;
}
